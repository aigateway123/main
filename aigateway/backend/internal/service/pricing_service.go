package service

import (
	"context"

	"aigateway/backend/internal/dto"
	"aigateway/backend/internal/entity"
	"aigateway/backend/internal/repository"
)

type PricingService struct {
	pricingRepo repository.ModelPricingRepository
	modelRepo   repository.ModelRepository
}

func NewPricingService(pricingRepo repository.ModelPricingRepository, modelRepo repository.ModelRepository) *PricingService {
	return &PricingService{
		pricingRepo: pricingRepo,
		modelRepo:   modelRepo,
	}
}

func (s *PricingService) List(ctx context.Context) ([]*dto.AdminPricingItem, error) {
	models, err := s.modelRepo.List(ctx, "")
	if err != nil {
		return nil, ErrInternal
	}

	pricings, err := s.pricingRepo.List(ctx)
	if err != nil {
		return nil, ErrInternal
	}
	pricingByModelID := make(map[int64]*entity.ModelPricing, len(pricings))
	for _, p := range pricings {
		pricingByModelID[p.ModelID] = p
	}

	out := make([]*dto.AdminPricingItem, 0, len(models))
	for _, m := range models {
		p := pricingByModelID[m.ID]
		if p != nil {
			out = append(out, toAdminPricingItem(m, p))
		} else {
			// 模型没有定价记录，生成一个只含模型信息的默认项
			out = append(out, &dto.AdminPricingItem{
				ModelID:       m.ID,
				ModelName:     m.ModelName,
				ModelCode:     m.ModelCode,
				PricingType:   "flat",
				Currency:      "USD",
				PricingStatus: "pending",
			})
		}
	}
	return out, nil
}

func (s *PricingService) GetByModelID(ctx context.Context, modelID int64) (*dto.AdminPricingItem, error) {
	m, err := s.modelRepo.GetByID(ctx, modelID)
	if err != nil {
		return nil, ErrModelNotFound
	}

	p, err := s.pricingRepo.GetByModelID(ctx, modelID)
	if err != nil {
		// 没有定价记录时，返回默认定价信息
		return &dto.AdminPricingItem{
			ModelID:       m.ID,
			ModelName:     m.ModelName,
			ModelCode:     m.ModelCode,
			PricingType:   "flat",
			Currency:      "USD",
			PricingStatus: "pending",
			UpdatedAt:     m.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
		}, nil
	}
	return toAdminPricingItem(m, p), nil
}

func (s *PricingService) UpdateByModelID(ctx context.Context, modelID int64, req *dto.AdminUpdatePricingRequest) (*dto.AdminPricingItem, error) {
	m, err := s.modelRepo.GetByID(ctx, modelID)
	if err != nil {
		return nil, ErrModelNotFound
	}

	pricingUnit := req.PricingUnit
	if pricingUnit == "" {
		pricingUnit = "token"
	}

	pricingStatus := "pending"
	if req.PricePerInputToken > 0 || req.PricePerOutputToken > 0 || (pricingUnit != "token" && req.UnitPrice != nil) {
		pricingStatus = "active"
	}

	p := &entity.ModelPricing{
		ModelID:               modelID,
		PricingType:           req.PricingType,
		PricePerInputToken:    req.PricePerInputToken,
		PricePerOutputToken:   req.PricePerOutputToken,
		Currency:              req.Currency,
		PricingUnit:           pricingUnit,
		UnitPrice:             req.UnitPrice,
		PeakStart:             req.PeakStart,
		PeakEnd:               req.PeakEnd,
		PeakPricePerInput:     req.PeakPricePerInput,
		PeakPricePerOutput:    req.PeakPricePerOutput,
		OffpeakPricePerInput:  req.OffpeakPricePerInput,
		OffpeakPricePerOutput: req.OffpeakPricePerOutput,
		PricingStatus:         pricingStatus,
	}

	updated, err := s.pricingRepo.Upsert(ctx, p)
	if err != nil {
		return nil, ErrInternal
	}
	return toAdminPricingItem(m, updated), nil
}

func toAdminPricingItem(m *entity.Model, p *entity.ModelPricing) *dto.AdminPricingItem {
	pricingUnit := p.PricingUnit
	if pricingUnit == "" {
		pricingUnit = "token"
	}

	return &dto.AdminPricingItem{
		ID:                    p.ID,
		ModelID:               p.ModelID,
		ModelName:             m.ModelName,
		ModelCode:             m.ModelCode,
		PricingType:           p.PricingType,
		PricePerInputToken:    p.PricePerInputToken,
		PricePerOutputToken:   p.PricePerOutputToken,
		Currency:              p.Currency,
		PricingUnit:           pricingUnit,
		UnitPrice:             p.UnitPrice,
		PeakStart:             p.PeakStart,
		PeakEnd:               p.PeakEnd,
		PeakPricePerInput:     p.PeakPricePerInput,
		PeakPricePerOutput:    p.PeakPricePerOutput,
		OffpeakPricePerInput:  p.OffpeakPricePerInput,
		OffpeakPricePerOutput: p.OffpeakPricePerOutput,
		PricingStatus:         p.PricingStatus,
		UpdatedAt:             p.UpdatedAt.Format("2006-01-02T15:04:05Z07:00"),
	}
}

