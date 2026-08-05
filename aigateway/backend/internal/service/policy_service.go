package service

import (
	"context"
	"errors"
	"log/slog"
	"strings"
	"time"

	"aigateway/backend/internal/dto"
	"aigateway/backend/internal/entity"
	"aigateway/backend/internal/repository"
)

type PolicyService struct {
	pricingRepo  repository.PricingRepository
	quotaRepo    repository.QuotaRepository
	providerRepo repository.ProviderRepository
	logRepo      repository.RequestLogRepository
	markupRate   float64 // 售价 = 成本 × markupRate
	logger       *slog.Logger
}

func NewPolicyService(
	pricingRepo repository.PricingRepository,
	quotaRepo repository.QuotaRepository,
	providerRepo repository.ProviderRepository,
	logRepo repository.RequestLogRepository,
	markupRate float64,
	logger *slog.Logger,
) *PolicyService {
	return &PolicyService{
		pricingRepo:  pricingRepo,
		quotaRepo:    quotaRepo,
		providerRepo: providerRepo,
		logRepo:      logRepo,
		markupRate:   markupRate,
		logger:       logger,
	}
}

// CalculateCost 计算单次请求的采购成本
// 查找(providerID, modelCode) 对应的生效定价，计算 inputTokens * inputPrice + outputTokens * outputPrice
// 如果未找到定价配置，返回 0 并记录 warn 日志（不返回 error，不阻塞主流程）
func (s *PolicyService) CalculateCost(ctx context.Context, providerID int64, modelCode string, inputTokens, outputTokens int) float64 {
	pricing, err := s.pricingRepo.GetByModelAndProvider(ctx, strings.ToLower(modelCode), providerID)
	if err != nil {
		if errors.Is(err, repository.ErrPricingNotFound) {
			s.logger.Warn("pricing not found, cost defaults to 0",
				"providerID", providerID,
				"modelCode", modelCode,
			)
		} else {
			s.logger.Error("failed to get pricing", "error", err, "providerID", providerID, "modelCode", modelCode)
		}
		return 0
	}

	cost := float64(inputTokens)*pricing.InputPrice + float64(outputTokens)*pricing.OutputPrice
	if cost < 0 {
		cost = 0
	}
	return cost
}

// CheckQuota 检查用户对某模型是否还有额度
// 如果未配置额度（ErrQuotaNotFound），返回 nil（视为无限）
// 如果额度用完（UsedTokens >= MaxTokens 或 UsedRequests >= MaxRequests），返回 ErrQuotaExceeded
func (s *PolicyService) CheckQuota(ctx context.Context, userID int64, modelCode string) error {
	quota, err := s.quotaRepo.GetByUserAndModel(ctx, userID, modelCode)
	if err != nil {
		if errors.Is(err, repository.ErrQuotaNotFound) {
			// Try global quota
			quota, err = s.quotaRepo.GetByUserAndModel(ctx, userID, "")
			if err != nil {
				if errors.Is(err, repository.ErrQuotaNotFound) {
					// No quota configured, treat as unlimited
					return nil
				}
				return ErrInternal
			}
		} else {
			return ErrInternal
		}
	}

	if quota.MaxTokens > 0 && quota.UsedTokens >= quota.MaxTokens {
		return ErrQuotaExceeded
	}
	if quota.MaxRequests > 0 && quota.UsedRequests >= quota.MaxRequests {
		return ErrQuotaExceeded
	}
	return nil
}

// ConsumeQuota 消费额度（在请求完成后调用）
// 更新 UsedTokens 和 UsedRequests
func (s *PolicyService) ConsumeQuota(ctx context.Context, userID int64, modelCode string, tokens int) error {
	err := s.quotaRepo.Consume(ctx, userID, modelCode, tokens, 1)
	if err != nil {
		if errors.Is(err, repository.ErrQuotaNotFound) {
			// No quota configured, skip consumption
			return nil
		}
		return ErrInternal
	}
	return nil
}

// CalculateProfit 利润聚合计算
// 遍历 RequestLog 统计总成本和总收入
// 收入 = 成本 × markupRate
func (s *PolicyService) CalculateProfit(ctx context.Context, userID int64) (*dto.ProfitResponse, error) {
	stats, err := s.logRepo.Stats(ctx, userID)
	if err != nil {
		return nil, ErrInternal
	}

	totalRevenue := stats.TotalCost * s.markupRate
	todayRevenue := stats.TodayCost * s.markupRate

	profitMargin := 0.0
	if totalRevenue > 0 {
		profitMargin = ((totalRevenue - stats.TotalCost) / totalRevenue) * 100
	}

	return &dto.ProfitResponse{
		TotalRevenue: float64(int(totalRevenue*100)) / 100,
		TotalCost:    float64(int(stats.TotalCost*100)) / 100,
		TotalProfit:  float64(int((totalRevenue-stats.TotalCost)*100)) / 100,
		TodayRevenue: float64(int(todayRevenue*100)) / 100,
		TodayCost:    float64(int(stats.TodayCost*100)) / 100,
		TodayProfit:  float64(int((todayRevenue-stats.TodayCost)*100)) / 100,
		ProfitMargin: float64(int(profitMargin*100)) / 100,
	}, nil
}

// CreatePricing 创建定价配置
func (s *PolicyService) CreatePricing(ctx context.Context, req *dto.CreatePricingRequest) (*dto.PricingResponse, error) {
	effectiveFrom, err := time.Parse(time.RFC3339, req.EffectiveFrom)
	if err != nil {
		return nil, ErrInvalidArgument
	}

	p := &entity.Pricing{
		ModelCode:     req.ModelCode,
		ProviderID:    req.ProviderID,
		InputPrice:    req.InputPrice,
		OutputPrice:   req.OutputPrice,
		EffectiveFrom: effectiveFrom,
	}

	if req.EffectiveTo != "" {
		effectiveTo, parseErr := time.Parse(time.RFC3339, req.EffectiveTo)
		if parseErr != nil {
			return nil, ErrInvalidArgument
		}
		p.EffectiveTo = &effectiveTo
	}

	if err := s.pricingRepo.Create(ctx, p); err != nil {
		if errors.Is(err, repository.ErrDuplicatePricing) {
			return nil, ErrDuplicateName
		}
		return nil, ErrInternal
	}

	return toPricingResponse(p), nil
}

// ListPricing 列出所有定价配置
func (s *PolicyService) ListPricing(ctx context.Context) ([]*dto.PricingResponse, error) {
	items, err := s.pricingRepo.List(ctx)
	if err != nil {
		return nil, ErrInternal
	}

	result := make([]*dto.PricingResponse, 0, len(items))
	for _, p := range items {
		result = append(result, toPricingResponse(p))
	}
	return result, nil
}

// UpdatePricing 更新定价配置
func (s *PolicyService) UpdatePricing(ctx context.Context, id int64, req *dto.UpdatePricingRequest) (*dto.PricingResponse, error) {
	existing, err := s.pricingRepo.GetByID(ctx, id)
	if err != nil {
		if errors.Is(err, repository.ErrPricingNotFound) {
			return nil, ErrPricingNotFound
		}
		return nil, ErrInternal
	}

	if req.InputPrice != nil {
		existing.InputPrice = *req.InputPrice
	}
	if req.OutputPrice != nil {
		existing.OutputPrice = *req.OutputPrice
	}
	if req.EffectiveTo != nil {
		if *req.EffectiveTo == "" {
			existing.EffectiveTo = nil
		} else {
			effectiveTo, parseErr := time.Parse(time.RFC3339, *req.EffectiveTo)
			if parseErr != nil {
				return nil, ErrInvalidArgument
			}
			existing.EffectiveTo = &effectiveTo
		}
	}

	if err := s.pricingRepo.Update(ctx, existing); err != nil {
		return nil, ErrInternal
	}

	return toPricingResponse(existing), nil
}

// CreateQuota 创建额度配置
func (s *PolicyService) CreateQuota(ctx context.Context, req *dto.CreateQuotaRequest) (*dto.QuotaResponse, error) {
	q := &entity.Quota{
		UserID:      req.UserID,
		ModelCode:   req.ModelCode,
		MaxTokens:   req.MaxTokens,
		MaxRequests: req.MaxRequests,
		ResetPeriod: req.ResetPeriod,
	}

	if err := s.quotaRepo.Create(ctx, q); err != nil {
		if errors.Is(err, repository.ErrDuplicateQuota) {
			return nil, ErrDuplicateName
		}
		return nil, ErrInternal
	}

	return toQuotaResponse(q), nil
}

// ListQuotas 列出额度配置，可按用户过滤
func (s *PolicyService) ListQuotas(ctx context.Context, userID int64) ([]*dto.QuotaResponse, error) {
	var items []*entity.Quota
	var err error

	if userID > 0 {
		items, err = s.quotaRepo.GetByUserID(ctx, userID)
	} else {
		items, err = s.quotaRepo.List(ctx)
	}

	if err != nil {
		return nil, ErrInternal
	}

	result := make([]*dto.QuotaResponse, 0, len(items))
	for _, q := range items {
		result = append(result, toQuotaResponse(q))
	}
	return result, nil
}

// UpdateQuota 更新额度配置
func (s *PolicyService) UpdateQuota(ctx context.Context, id int64, req *dto.UpdateQuotaRequest) (*dto.QuotaResponse, error) {
	existing, err := s.quotaRepo.GetByID(ctx, id)
	if err != nil {
		if errors.Is(err, repository.ErrQuotaNotFound) {
			return nil, ErrQuotaNotFound
		}
		return nil, ErrInternal
	}

	if req.MaxTokens != nil {
		existing.MaxTokens = *req.MaxTokens
	}
	if req.MaxRequests != nil {
		existing.MaxRequests = *req.MaxRequests
	}
	if req.UsedTokens != nil {
		existing.UsedTokens = *req.UsedTokens
	}
	if req.UsedRequests != nil {
		existing.UsedRequests = *req.UsedRequests
	}
	if req.ResetPeriod != nil {
		existing.ResetPeriod = *req.ResetPeriod
	}

	if err := s.quotaRepo.Update(ctx, existing); err != nil {
		return nil, ErrInternal
	}

	return toQuotaResponse(existing), nil
}

func toPricingResponse(p *entity.Pricing) *dto.PricingResponse {
	resp := &dto.PricingResponse{
		ID:            p.ID,
		ModelCode:     p.ModelCode,
		ProviderID:    p.ProviderID,
		InputPrice:    p.InputPrice,
		OutputPrice:   p.OutputPrice,
		EffectiveFrom: p.EffectiveFrom.Format("2006-01-02T15:04:05Z07:00"),
		CreatedAt:     p.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
		UpdatedAt:     p.UpdatedAt.Format("2006-01-02T15:04:05Z07:00"),
	}
	if p.EffectiveTo != nil {
		resp.EffectiveTo = p.EffectiveTo.Format("2006-01-02T15:04:05Z07:00")
	}
	return resp
}

func toQuotaResponse(q *entity.Quota) *dto.QuotaResponse {
	return &dto.QuotaResponse{
		ID:           q.ID,
		UserID:       q.UserID,
		ModelCode:    q.ModelCode,
		MaxTokens:    q.MaxTokens,
		MaxRequests:  q.MaxRequests,
		UsedTokens:   q.UsedTokens,
		UsedRequests: q.UsedRequests,
		ResetPeriod:  q.ResetPeriod,
		CreatedAt:    q.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
		UpdatedAt:    q.UpdatedAt.Format("2006-01-02T15:04:05Z07:00"),
	}
}


