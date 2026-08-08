package service

import (
	"context"
	"encoding/json"
	"errors"
	"time"

	"aigateway/backend/internal/entity"
	"aigateway/backend/internal/repository"
)

// UsageInfo holds usage information for cost computation.
type UsageInfo struct {
	InputTokens  int
	OutputTokens int
	ImageCount   int
	Size         string
}

type BillingService struct {
	userRepo          repository.UserRepository
	rbacSvc           *RBACService
	userModelPermRepo repository.UserModelPermissionRepository
	pricingRepo       repository.ModelPricingRepository
	billingRepo       repository.BillingRepository
	adminUserRepo     repository.AdminUserRepository
	logRepo           repository.RequestLogRepository
	modelRepo         repository.ModelRepository
}

func NewBillingService(
	userRepo repository.UserRepository,
	rbacSvc *RBACService,
	userModelPermRepo repository.UserModelPermissionRepository,
	pricingRepo repository.ModelPricingRepository,
	billingRepo repository.BillingRepository,
	adminUserRepo repository.AdminUserRepository,
	logRepo repository.RequestLogRepository,
	modelRepo repository.ModelRepository,
) *BillingService {
	return &BillingService{
		userRepo:          userRepo,
		rbacSvc:           rbacSvc,
		userModelPermRepo: userModelPermRepo,
		pricingRepo:       pricingRepo,
		billingRepo:       billingRepo,
		adminUserRepo:     adminUserRepo,
		logRepo:           logRepo,
		modelRepo:         modelRepo,
	}
}

func (s *BillingService) EnsureQuotaAvailable(ctx context.Context, userID int64) error {
	u, err := s.userRepo.GetByID(ctx, userID)
	if err != nil {
		return ErrUserNotFound
	}
	// Admin users are exempt from quota checks
	if s.rbacSvc != nil {
		if _, roleName, err := s.rbacSvc.GetUserRole(ctx, userID); err == nil && roleName == "Admin" {
			return nil
		}
	}
	if u.UserStatus != "active" {
		return ErrUserDisabled
	}
	if u.QuotaBalance <= 0 {
		return ErrQuotaExceeded
	}
	return nil
}

func (s *BillingService) CheckModelAccess(ctx context.Context, userID int64, modelID int64) error {
	if s.rbacSvc != nil {
		_, roleName, err := s.rbacSvc.GetUserRole(ctx, userID)
		if err == nil && roleName == "Admin" {
			return nil
		}
	}

	// Public models are accessible by all roles
	if s.modelRepo != nil {
		if m, err := s.modelRepo.GetByID(ctx, modelID); err == nil && m.IsPublic {
			return nil
		}
	}

	ok, err := s.userModelPermRepo.Exists(ctx, userID, modelID)
	if err != nil {
		return ErrInternal
	}
	if !ok {
		return ErrModelForbidden
	}
	return nil
}

func (s *BillingService) ComputeCost(ctx context.Context, modelID int64, inputTokens int, outputTokens int, at time.Time) (float64, error) {
	p, err := s.pricingRepo.GetByModelID(ctx, modelID)
	if err != nil {
		if errors.Is(err, repository.ErrPricingNotFound) {
			return 0, ErrInternal
		}
		return 0, ErrInternal
	}

	// Handle non-token pricing units
	if p.PricingUnit != "" && p.PricingUnit != "token" && p.PricingUnit != "per_million_tokens" {
		return 0, ErrInternal
	}

	inputPrice := p.PricePerInputToken
	outputPrice := p.PricePerOutputToken

	if p.PricingType == "time_based" {
		if p.PeakStart != nil && p.PeakEnd != nil && p.PeakPricePerInput != nil && p.PeakPricePerOutput != nil && p.OffpeakPricePerInput != nil && p.OffpeakPricePerOutput != nil {
			if isWithinTimeRange(at, *p.PeakStart, *p.PeakEnd) {
				inputPrice = *p.PeakPricePerInput
				outputPrice = *p.PeakPricePerOutput
			} else {
				inputPrice = *p.OffpeakPricePerInput
				outputPrice = *p.OffpeakPricePerOutput
			}
		}
	}

	cost := float64(inputTokens)*inputPrice + float64(outputTokens)*outputPrice
	if p.PricingUnit == "per_million_tokens" {
		cost = cost / 1_000_000
	}
	if cost < 0 {
		cost = 0
	}
	return cost, nil
}

// ComputeImageCost calculates the cost for image generation based on pricing unit.
func (s *BillingService) ComputeImageCost(ctx context.Context, modelID int64, imageCount int, size string, at time.Time) (float64, error) {
	p, err := s.pricingRepo.GetByModelID(ctx, modelID)
	if err != nil {
		if errors.Is(err, repository.ErrPricingNotFound) {
			return 0, ErrInternal
		}
		return 0, ErrInternal
	}

	return calculateImageCost(p, imageCount, size), nil
}

// calculateImageCost computes the cost for image generation.
func calculateImageCost(pricing *entity.ModelPricing, imageCount int, size string) float64 {
	if pricing.PricingUnit == "image_count" && pricing.UnitPrice != nil {
		var unitPrice struct {
			PerImage    float64            `json:"per_image"`
			Resolutions map[string]float64 `json:"resolutions,omitempty"`
		}
		if err := json.Unmarshal(*pricing.UnitPrice, &unitPrice); err == nil {
			price := unitPrice.PerImage
			if unitPrice.Resolutions != nil {
				if resolutionPrice, ok := unitPrice.Resolutions[size]; ok {
					price = resolutionPrice
				}
			}
			cost := price * float64(imageCount)
			if cost < 0 {
				cost = 0
			}
			return cost
		}
	}
	// Fall back to output token price as a proxy for per-image cost
	cost := float64(imageCount) * pricing.PricePerOutputToken
	if pricing.PricingUnit == "per_million_tokens" {
		cost = cost / 1_000_000
	}
	if cost < 0 {
		cost = 0
	}
	return cost
}

func (s *BillingService) DeductAndRecord(ctx context.Context, log *entity.RequestLog, costAmount float64) error {
	err := s.billingRepo.DeductQuotaAndRecord(ctx, log, costAmount)
	if err != nil {
		if errors.Is(err, repository.ErrQuotaExceeded) {
			return ErrQuotaExceeded
		}
		if errors.Is(err, repository.ErrUserNotFound) {
			return ErrUserNotFound
		}
		return ErrInternal
	}
	return nil
}

func (s *BillingService) GetQuota(ctx context.Context, userID int64) (quotaBalance float64, totalSpent float64, totalAllocated float64, err error) {
	u, err := s.userRepo.GetByID(ctx, userID)
	if err != nil {
		return 0, 0, 0, ErrUserNotFound
	}
	if s.adminUserRepo != nil {
		totalAllocated, totalSpent, err = s.adminUserRepo.GetQuotaTotals(ctx, userID)
		if err != nil {
			return 0, 0, 0, ErrInternal
		}
	}
	return u.QuotaBalance, totalSpent, totalAllocated, nil
}

func (s *BillingService) GetUsage(ctx context.Context, userID int64, page, pageSize int, startDate, endDate, modelCode string) ([]*entity.RequestLog, int, error) {
	if s.logRepo == nil {
		return nil, 0, ErrInternal
	}
	offset := (page - 1) * pageSize
	logs, total, err := s.logRepo.ListByUserIDFiltered(ctx, userID, offset, pageSize, startDate, endDate, modelCode)
	if err != nil {
		return nil, 0, ErrInternal
	}
	return logs, total, nil
}

func (s *BillingService) GetAdminSummary(ctx context.Context) (*repository.AdminUsageStats, error) {
	if s.logRepo == nil {
		return nil, ErrInternal
	}
	stats, err := s.logRepo.AdminStats(ctx)
	if err != nil {
		return nil, ErrInternal
	}
	return stats, nil
}

func (s *BillingService) GetAdminUsage(ctx context.Context, userID int64, page, pageSize int, startDate, endDate, status string) ([]*entity.RequestLog, int, error) {
	if s.logRepo == nil {
		return nil, 0, ErrInternal
	}
	offset := (page - 1) * pageSize
	logs, total, err := s.logRepo.AdminList(ctx, offset, pageSize, userID, startDate, endDate, status)
	if err != nil {
		return nil, 0, ErrInternal
	}
	return logs, total, nil
}

// AdminUsageItem is a single billing detail record with resolved user email.
type AdminUsageItem struct {
	ID            int64   `json:"id"`
	UserID        int64   `json:"userId"`
	Email         string  `json:"email"`
	ModelCode     string  `json:"modelCode"`
	ModelName     string  `json:"modelName"`
	InputTokens   int     `json:"inputTokens"`
	OutputTokens  int     `json:"outputTokens"`
	CostAmount    float64 `json:"costAmount"`
	RequestStatus string  `json:"requestStatus"`
	CreatedAt     string  `json:"createdAt"`
}

// GetAdminUsageItems returns admin billing detail records enriched with user emails.
func (s *BillingService) GetAdminUsageItems(ctx context.Context, userID int64, page, pageSize int, startDate, endDate, status string) ([]*AdminUsageItem, int, error) {
	logs, total, err := s.GetAdminUsage(ctx, userID, page, pageSize, startDate, endDate, status)
	if err != nil {
		return nil, 0, err
	}

	// Resolve emails in bulk
	emailByUserID := make(map[int64]string, len(logs))
	for _, l := range logs {
		if _, ok := emailByUserID[l.UserID]; ok {
			continue
		}
		if u, err := s.userRepo.GetByID(ctx, l.UserID); err == nil {
			emailByUserID[l.UserID] = u.Email
		}
	}

	items := make([]*AdminUsageItem, 0, len(logs))
	for _, l := range logs {
		items = append(items, &AdminUsageItem{
			ID:            l.ID,
			UserID:        l.UserID,
			Email:         emailByUserID[l.UserID],
			ModelCode:     l.ModelCode,
			ModelName:     l.ModelCode,
			InputTokens:   l.InputTokens,
			OutputTokens:  l.OutputTokens,
			CostAmount:    l.CostAmount,
			RequestStatus: l.RequestStatus,
			CreatedAt:     l.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
		})
	}
	return items, total, nil
}

func isWithinTimeRange(t time.Time, start string, end string) bool {
	loc := t.Location()
	st, err1 := time.ParseInLocation("15:04:05", start, loc)
	et, err2 := time.ParseInLocation("15:04:05", end, loc)
	if err1 != nil || err2 != nil {
		return false
	}

	now := time.Date(2000, 1, 1, t.Hour(), t.Minute(), t.Second(), 0, loc)
	sd := time.Date(2000, 1, 1, st.Hour(), st.Minute(), st.Second(), 0, loc)
	ed := time.Date(2000, 1, 1, et.Hour(), et.Minute(), et.Second(), 0, loc)

	if sd.Equal(ed) {
		return true
	}
	if sd.Before(ed) {
		return (now.Equal(sd) || now.After(sd)) && now.Before(ed)
	}
	return (now.Equal(sd) || now.After(sd)) || now.Before(ed)
}

