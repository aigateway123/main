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
}

func NewBillingService(
	userRepo repository.UserRepository,
	rbacSvc *RBACService,
	userModelPermRepo repository.UserModelPermissionRepository,
	pricingRepo repository.ModelPricingRepository,
	billingRepo repository.BillingRepository,
	adminUserRepo repository.AdminUserRepository,
	logRepo repository.RequestLogRepository,
) *BillingService {
	return &BillingService{
		userRepo:          userRepo,
		rbacSvc:           rbacSvc,
		userModelPermRepo: userModelPermRepo,
		pricingRepo:       pricingRepo,
		billingRepo:       billingRepo,
		adminUserRepo:     adminUserRepo,
		logRepo:           logRepo,
	}
}

func (s *BillingService) EnsureQuotaAvailable(ctx context.Context, userID int64) error {
	u, err := s.userRepo.GetByID(ctx, userID)
	if err != nil {
		return ErrUserNotFound
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
	if p.PricingUnit != "" && p.PricingUnit != "token" {
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

