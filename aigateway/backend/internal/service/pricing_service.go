package service

import (
	"context"
	"fmt"
	"sort"
	"strings"
	"time"

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

	// 组装高峰时段（§7.3/M3）：请求含 peakRanges 以请求为准；否则旧字段 trim 后非空时兼容转换为单组；否则 0 组。
	peakRanges := buildPeakRanges(req)
	// 校验（§10.2）：格式 HH:MM/HH:MM:SS、start >= end 拒绝、重叠拒绝、组数上限 8。
	if err := validatePeakRanges(peakRanges); err != nil {
		return nil, err
	}

	pricingUnit := req.PricingUnit
	if pricingUnit == "" {
		pricingUnit = "token"
	}

	// 定价状态：优先采用前端显式传入的值；否则按已配置价格自动判定。
	// 分时段定价只要配置了高峰/低谷任一价格即视为已配置。
	pricingStatus := req.PricingStatus
	if pricingStatus == "" {
		pricingStatus = "pending"
		if req.PricePerInputToken > 0 || req.PricePerOutputToken > 0 || (pricingUnit != "token" && req.UnitPrice != nil) {
			pricingStatus = "active"
		} else if (pricingUnit == "token" || pricingUnit == "per_million_tokens") && req.PricingType == "time_based" &&
			(req.PeakPricePerInput != nil || req.PeakPricePerOutput != nil ||
				req.OffpeakPricePerInput != nil || req.OffpeakPricePerOutput != nil) {
			pricingStatus = "active"
		}
	}

	p := &entity.ModelPricing{
		ModelID:               modelID,
		PricingType:           req.PricingType,
		PricePerInputToken:    req.PricePerInputToken,
		PricePerOutputToken:   req.PricePerOutputToken,
		Currency:              req.Currency,
		PricingUnit:           pricingUnit,
		UnitPrice:             req.UnitPrice,
		PeakStart:             nil, // 写库统一为 NULL，权威数据源为子表（§7.3）
		PeakEnd:               nil,
		PeakRanges:            peakRanges,
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

// maxPeakRanges 高峰时段组数上限（§10.2）。
const maxPeakRanges = 8

// buildPeakRanges 按 §7.3/M3 组装高峰时段：
//   - 请求显式传了 peakRanges（指针非 nil，含空数组 = 0 组）→ 一律以请求为准；
//   - 请求未传 peakRanges（nil）且旧字段 peakStart/peakEnd trim 后均为非空串 → 兼容转换为单组；
//   - 否则 → 0 组（空数组）。
func buildPeakRanges(req *dto.AdminUpdatePricingRequest) []entity.TimeRange {
	if req.PeakRanges != nil {
		ranges := make([]entity.TimeRange, 0, len(*req.PeakRanges))
		for _, r := range *req.PeakRanges {
			ranges = append(ranges, entity.TimeRange{Start: r.Start, End: r.End})
		}
		return ranges
	}
	if req.PeakStart != nil && req.PeakEnd != nil {
		start := strings.TrimSpace(*req.PeakStart)
		end := strings.TrimSpace(*req.PeakEnd)
		if start != "" && end != "" {
			return []entity.TimeRange{{Start: start, End: end}}
		}
	}
	return []entity.TimeRange{}
}

// validatePeakRanges 校验高峰时段（§10.2）：
// 每组格式须为 HH:MM 或 HH:MM:SS；start >= end 强制拒绝；重叠强制拒绝；组数上限 8。
func validatePeakRanges(ranges []entity.TimeRange) error {
	if len(ranges) > maxPeakRanges {
		return newValidationError(fmt.Sprintf("高峰时段最多 %d 组", maxPeakRanges))
	}

	type segment struct{ s, e int }
	segs := make([]segment, 0, len(ranges))
	for _, r := range ranges {
		s, err := parseClockToSeconds(r.Start)
		if err != nil {
			return newValidationError("高峰时段格式无效，应为 HH:MM 或 HH:MM:SS")
		}
		e, err := parseClockToSeconds(r.End)
		if err != nil {
			return newValidationError("高峰时段格式无效，应为 HH:MM 或 HH:MM:SS")
		}
		if s >= e {
			return newValidationError("高峰时段的开始时间必须早于结束时间")
		}
		segs = append(segs, segment{s, e})
	}

	// 重叠检测：按开始时间排序后扫描（§10.2 伪代码）
	sort.Slice(segs, func(i, j int) bool { return segs[i].s < segs[j].s })
	for i := 1; i < len(segs); i++ {
		if segs[i].s < segs[i-1].e {
			return newValidationError("高峰时段存在重叠")
		}
	}
	return nil
}

// parseClockToSeconds 解析 "HH:MM"（视为 HH:MM:00）或 "HH:MM:SS" 为当天秒数（0~86399）。
// 秒级精度保证 09:00:00~09:00:30 这类秒级合法区间不被误判为 start>=end。
func parseClockToSeconds(s string) (int, error) {
	if t, err := time.Parse("15:04", s); err == nil {
		return t.Hour()*3600 + t.Minute()*60, nil
	}
	t, err := time.Parse("15:04:05", s)
	if err != nil {
		return 0, err
	}
	return t.Hour()*3600 + t.Minute()*60 + t.Second(), nil
}

// newValidationError 构造校验失败错误（HTTP 400），可通过 errors.Is(err, ErrInvalidArgument) 匹配。
func newValidationError(msg string) error {
	return &ValidationError{Message: msg}
}

func toAdminPricingItem(m *entity.Model, p *entity.ModelPricing) *dto.AdminPricingItem {
	pricingUnit := p.PricingUnit
	if pricingUnit == "" {
		pricingUnit = "token"
	}

	// 填充 PeakRanges，并由 PeakRanges[0] 派生旧字段 peakStart/peakEnd（无时段则为 NULL，§7.3）
	peakRanges := make([]dto.TimeRangeDTO, 0, len(p.PeakRanges))
	var peakStart, peakEnd *string
	for i, r := range p.PeakRanges {
		peakRanges = append(peakRanges, dto.TimeRangeDTO{Start: r.Start, End: r.End})
		if i == 0 {
			s, e := r.Start, r.End
			peakStart, peakEnd = &s, &e
		}
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
		PeakStart:             peakStart,
		PeakEnd:               peakEnd,
		PeakRanges:            peakRanges,
		PeakPricePerInput:     p.PeakPricePerInput,
		PeakPricePerOutput:    p.PeakPricePerOutput,
		OffpeakPricePerInput:  p.OffpeakPricePerInput,
		OffpeakPricePerOutput: p.OffpeakPricePerOutput,
		PricingStatus:         p.PricingStatus,
		UpdatedAt:             p.UpdatedAt.Format("2006-01-02T15:04:05Z07:00"),
	}
}

