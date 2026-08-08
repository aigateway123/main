package service

import (
	"errors"
	"fmt"
	"reflect"
	"testing"

	"aigateway/backend/internal/dto"
	"aigateway/backend/internal/entity"
)

func TestValidatePeakRanges(t *testing.T) {
	assertRejected := func(t *testing.T, name string, ranges []entity.TimeRange) {
		t.Helper()
		t.Run(name, func(t *testing.T) {
			err := validatePeakRanges(ranges)
			if err == nil {
				t.Fatalf("validatePeakRanges(%v) 期望拒绝，实际通过", ranges)
			}
			if !errors.Is(err, ErrInvalidArgument) {
				t.Errorf("error %v 未匹配 ErrInvalidArgument", err)
			}
		})
	}

	assertAccepted := func(t *testing.T, name string, ranges []entity.TimeRange) {
		t.Helper()
		t.Run(name, func(t *testing.T) {
			if err := validatePeakRanges(ranges); err != nil {
				t.Fatalf("validatePeakRanges(%v) 期望通过，实际: %v", ranges, err)
			}
		})
	}

	assertRejected(t, "格式非法拒绝（非时间串）", []entity.TimeRange{{Start: "abc", End: "12:00"}})
	assertRejected(t, "格式非法拒绝（小时越界）", []entity.TimeRange{{Start: "25:00", End: "12:00"}})
	assertRejected(t, "start==end 拒绝", []entity.TimeRange{{Start: "12:00", End: "12:00"}})
	assertRejected(t, "start>end 拒绝", []entity.TimeRange{{Start: "14:00", End: "09:00"}})
	assertRejected(t, "重叠拒绝", []entity.TimeRange{{Start: "09:00", End: "12:00"}, {Start: "11:00", End: "13:00"}})
	assertRejected(t, "秒级重叠拒绝", []entity.TimeRange{{Start: "09:00:00", End: "09:00:30"}, {Start: "09:00:15", End: "09:00:45"}})

	// 超过 8 组拒绝（9 组互不重叠，仅因组数超限）
	nine := make([]entity.TimeRange, 9)
	for i := range nine {
		nine[i] = entity.TimeRange{Start: fmt.Sprintf("%02d:00", i+1), End: fmt.Sprintf("%02d:30", i+1)}
	}
	assertRejected(t, "超过 8 组拒绝", nine)

	assertAccepted(t, "0 组（空数组）通过", []entity.TimeRange{})
	assertAccepted(t, "合法两组通过", []entity.TimeRange{{Start: "09:00", End: "12:00"}, {Start: "14:00", End: "18:00"}})
	assertAccepted(t, "秒级合法区间通过（HH:MM:SS start<end）", []entity.TimeRange{{Start: "09:00:00", End: "09:00:30"}})
	assertAccepted(t, "首尾相接不重叠通过", []entity.TimeRange{{Start: "09:00", End: "12:00"}, {Start: "12:00", End: "14:00"}})
}

func TestBuildPeakRanges(t *testing.T) {
	strPtr := func(s string) *string { return &s }

	t.Run("仅请求含 peakRanges 时以请求为准（忽略旧字段）", func(t *testing.T) {
		req := &dto.AdminUpdatePricingRequest{
			PeakStart:  strPtr("08:00"),
			PeakEnd:    strPtr("10:00"),
			PeakRanges: &[]dto.TimeRangeDTO{{Start: "09:00", End: "12:00"}, {Start: "14:00", End: "18:00"}},
		}
		want := []entity.TimeRange{{Start: "09:00", End: "12:00"}, {Start: "14:00", End: "18:00"}}
		if got := buildPeakRanges(req); !reflect.DeepEqual(got, want) {
			t.Errorf("buildPeakRanges = %v, want %v", got, want)
		}
	})

	t.Run("显式空数组 = 0 组，不回退旧字段", func(t *testing.T) {
		req := &dto.AdminUpdatePricingRequest{
			PeakStart:  strPtr("08:00"),
			PeakEnd:    strPtr("10:00"),
			PeakRanges: &[]dto.TimeRangeDTO{},
		}
		if got := buildPeakRanges(req); len(got) != 0 {
			t.Errorf("buildPeakRanges = %v, 期望 0 组（显式空数组优先）", got)
		}
	})

	t.Run("未传 peakRanges，旧字段 trim 后非空 → 单组", func(t *testing.T) {
		req := &dto.AdminUpdatePricingRequest{
			PeakStart: strPtr(" 09:00 "),
			PeakEnd:   strPtr(" 12:00 "),
		}
		want := []entity.TimeRange{{Start: "09:00", End: "12:00"}}
		if got := buildPeakRanges(req); !reflect.DeepEqual(got, want) {
			t.Errorf("buildPeakRanges = %v, want %v（应 trim 后转单组）", got, want)
		}
	})

	t.Run("未传 peakRanges 且旧字段为空串 → 0 组", func(t *testing.T) {
		req := &dto.AdminUpdatePricingRequest{PeakStart: strPtr(""), PeakEnd: strPtr("")}
		if got := buildPeakRanges(req); len(got) != 0 {
			t.Errorf("buildPeakRanges = %v, 期望 0 组（空串不生成 range）", got)
		}
	})

	t.Run("未传 peakRanges 且旧字段为纯空白 → 0 组", func(t *testing.T) {
		req := &dto.AdminUpdatePricingRequest{PeakStart: strPtr("   "), PeakEnd: strPtr(" \t ")}
		if got := buildPeakRanges(req); len(got) != 0 {
			t.Errorf("buildPeakRanges = %v, 期望 0 组（纯空白不生成 range）", got)
		}
	})

	t.Run("全部缺省 → 0 组", func(t *testing.T) {
		if got := buildPeakRanges(&dto.AdminUpdatePricingRequest{}); len(got) != 0 {
			t.Errorf("buildPeakRanges = %v, 期望 0 组", got)
		}
	})
}
