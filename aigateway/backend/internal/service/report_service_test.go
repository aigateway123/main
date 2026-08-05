package service

import (
	"context"
	"log/slog"
	"os"
	"testing"
	"time"

	"aigateway/backend/internal/entity"
	"aigateway/backend/internal/repository"
)

// mockReportRepo implements repository.ReportRepository for testing.
type mockReportRepo struct {
	getTodayRevenueFn         func() (float64, int, error)
	getCurrentMonthRevenueFn  func() (float64, int, error)
	getUserTodaySummaryFn     func(userID int64) (float64, int, error)
	getCurrentMonthRevenueByUserFn func(userID int64) (float64, int, error)
	getDailyStatsFn           func(startDate, endDate time.Time) ([]*entity.BillingDailyStats, error)
	getDailyStatsByUserFn     func(startDate, endDate time.Time) ([]*entity.BillingDailyStats, error)
	getDailyStatsByModelFn    func(startDate, endDate time.Time) ([]*entity.BillingDailyStats, error)
	getUserDailyStatsFn       func(userID int64, startDate, endDate time.Time) ([]*entity.BillingDailyStats, error)
	runDailyAggregationFn     func(statDate time.Time) error
}

func (m *mockReportRepo) GetTodayRevenue(ctx context.Context) (float64, int, error) {
	return m.getTodayRevenueFn()
}

func (m *mockReportRepo) GetCurrentMonthRevenue(ctx context.Context) (float64, int, error) {
	return m.getCurrentMonthRevenueFn()
}

func (m *mockReportRepo) GetUserTodaySummary(ctx context.Context, userID int64) (float64, int, error) {
	return m.getUserTodaySummaryFn(userID)
}

func (m *mockReportRepo) GetCurrentMonthRevenueByUser(ctx context.Context, userID int64) (float64, int, error) {
	return m.getCurrentMonthRevenueByUserFn(userID)
}

func (m *mockReportRepo) GetDailyStats(ctx context.Context, startDate, endDate time.Time) ([]*entity.BillingDailyStats, error) {
	return m.getDailyStatsFn(startDate, endDate)
}

func (m *mockReportRepo) GetDailyStatsByUser(ctx context.Context, startDate, endDate time.Time) ([]*entity.BillingDailyStats, error) {
	return m.getDailyStatsByUserFn(startDate, endDate)
}

func (m *mockReportRepo) GetDailyStatsByModel(ctx context.Context, startDate, endDate time.Time) ([]*entity.BillingDailyStats, error) {
	return m.getDailyStatsByModelFn(startDate, endDate)
}

func (m *mockReportRepo) GetUserDailyStats(ctx context.Context, userID int64, startDate, endDate time.Time) ([]*entity.BillingDailyStats, error) {
	return m.getUserDailyStatsFn(userID, startDate, endDate)
}

func (m *mockReportRepo) RunDailyAggregation(ctx context.Context, statDate time.Time) error {
	return m.runDailyAggregationFn(statDate)
}

// mockModelRepo implements repository.ModelRepository for testing.
type mockModelRepo struct {
	listFn func() ([]*entity.Model, error)
}

func (m *mockModelRepo) Create(ctx context.Context, model *entity.Model) error { return nil }
func (m *mockModelRepo) GetByID(ctx context.Context, id int64) (*entity.Model, error) { return nil, nil }
func (m *mockModelRepo) GetByCode(ctx context.Context, code string) (*entity.Model, error) { return nil, nil }
func (m *mockModelRepo) List(ctx context.Context, _ string) ([]*entity.Model, error) { return m.listFn() }
func (m *mockModelRepo) Update(ctx context.Context, model *entity.Model) error { return nil }
func (m *mockModelRepo) Delete(ctx context.Context, id int64) error { return nil }

// mockUserRepo implements repository.UserRepository for testing.
type mockUserRepo struct {
	getByIDFn func(id int64) (*entity.User, error)
}

func (m *mockUserRepo) Create(ctx context.Context, user *entity.User) error { return nil }
func (m *mockUserRepo) GetByEmail(ctx context.Context, email string) (*entity.User, error) { return nil, nil }
func (m *mockUserRepo) GetByID(ctx context.Context, id int64) (*entity.User, error) { return m.getByIDFn(id) }

// mockLogRepo implements repository.RequestLogRepository for testing.
type mockLogRepo struct {
	listByUserIDFilteredFn func(userID int64, offset, limit int, startDate, endDate, modelCode string) ([]*entity.RequestLog, int, error)
}

func (m *mockLogRepo) Create(ctx context.Context, log *entity.RequestLog) error { return nil }
func (m *mockLogRepo) List(ctx context.Context, userID int64, offset, limit int) ([]*entity.RequestLog, int, error) { return nil, 0, nil }
func (m *mockLogRepo) CountByUserID(ctx context.Context, userID int64) (int, error) { return 0, nil }
func (m *mockLogRepo) Stats(ctx context.Context, userID int64) (*repository.UsageStats, error) { return nil, nil }
func (m *mockLogRepo) Recent(ctx context.Context, userID int64, limit int) ([]*entity.RequestLog, error) { return nil, nil }
func (m *mockLogRepo) ListByUserIDFiltered(ctx context.Context, userID int64, offset, limit int, startDate, endDate, modelCode string) ([]*entity.RequestLog, int, error) {
	return m.listByUserIDFilteredFn(userID, offset, limit, startDate, endDate, modelCode)
}
func (m *mockLogRepo) AdminStats(ctx context.Context) (*repository.AdminUsageStats, error) { return nil, nil }
func (m *mockLogRepo) AdminList(ctx context.Context, offset, limit int, filterUserID int64, startDate, endDate, status string) ([]*entity.RequestLog, int, error) { return nil, 0, nil }

func TestReportService_GetSummary(t *testing.T) {
	logger := slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelError}))

	tests := []struct {
		name          string
		todayRevenue  float64
		todayCount    int
		monthRevenue  float64
		monthCount    int
		wantTodayRev  float64
		wantTodayCnt  int
		wantMonthRev  float64
		wantMonthCnt  int
	}{
		{
			name:         "正常数据",
			todayRevenue: 328.50,
			todayCount:   12845,
			monthRevenue: 8450.00,
			monthCount:   245800,
			wantTodayRev: 328.50,
			wantTodayCnt: 12845,
			wantMonthRev: 8450.00,
			wantMonthCnt: 245800,
		},
		{
			name:         "零数据",
			todayRevenue: 0,
			todayCount:   0,
			monthRevenue: 0,
			monthCount:   0,
			wantTodayRev: 0,
			wantTodayCnt: 0,
			wantMonthRev: 0,
			wantMonthCnt: 0,
		},
		{
			name:         "仅有今日数据",
			todayRevenue: 100.00,
			todayCount:   500,
			monthRevenue: 0,
			monthCount:   0,
			wantTodayRev: 100.00,
			wantTodayCnt: 500,
			wantMonthRev: 0,
			wantMonthCnt: 0,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			reportRepo := &mockReportRepo{
				getTodayRevenueFn: func() (float64, int, error) {
					return tt.todayRevenue, tt.todayCount, nil
				},
				getCurrentMonthRevenueFn: func() (float64, int, error) {
					return tt.monthRevenue, tt.monthCount, nil
				},
			}

			svc := NewReportService(reportRepo, nil, nil, nil, logger)

			summary, err := svc.GetSummary(context.Background(), time.Now(), time.Now())
			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}

			if summary.Today.Revenue != tt.wantTodayRev {
				t.Errorf("Today Revenue = %v, want %v", summary.Today.Revenue, tt.wantTodayRev)
			}
			if summary.Today.RequestCount != tt.wantTodayCnt {
				t.Errorf("Today RequestCount = %v, want %v", summary.Today.RequestCount, tt.wantTodayCnt)
			}
			if summary.CurrentMonth.Revenue != tt.wantMonthRev {
				t.Errorf("Month Revenue = %v, want %v", summary.CurrentMonth.Revenue, tt.wantMonthRev)
			}
			if summary.CurrentMonth.RequestCount != tt.wantMonthCnt {
				t.Errorf("Month RequestCount = %v, want %v", summary.CurrentMonth.RequestCount, tt.wantMonthCnt)
			}
		})
	}
}

func TestReportService_GetByModel(t *testing.T) {
	logger := slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelError}))

	mockModels := []*entity.Model{
		{ID: 1, ModelName: "GPT-4o", ModelCode: "gpt-4o"},
		{ID: 2, ModelName: "DeepSeek V3", ModelCode: "deepseek-v3"},
	}

	tests := []struct {
		name     string
		stats    []*entity.BillingDailyStats
		wantLen  int
		wantTop  string // name of top model by revenue
		wantTopRev float64
	}{
		{
			name: "多个模型数据",
			stats: []*entity.BillingDailyStats{
				{ModelID: 1, RequestCount: 100, InputTokens: 10000, OutputTokens: 5000, TotalRevenue: 50.0},
				{ModelID: 2, RequestCount: 200, InputTokens: 50000, OutputTokens: 20000, TotalRevenue: 80.0},
			},
			wantLen: 2,
			wantTop: "DeepSeek V3",
			wantTopRev: 80.0,
		},
		{
			name:     "空数据",
			stats:    []*entity.BillingDailyStats{},
			wantLen:  0,
			wantTop:  "",
			wantTopRev: 0,
		},
		{
			name: "单模型-多天合并",
			stats: []*entity.BillingDailyStats{
				{ModelID: 1, RequestCount: 50, InputTokens: 5000, OutputTokens: 2500, TotalRevenue: 25.0},
				{ModelID: 1, RequestCount: 30, InputTokens: 3000, OutputTokens: 1500, TotalRevenue: 15.0},
			},
			wantLen: 1,
			wantTop: "GPT-4o",
			wantTopRev: 40.0,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			reportRepo := &mockReportRepo{
				getDailyStatsByModelFn: func(startDate, endDate time.Time) ([]*entity.BillingDailyStats, error) {
					return tt.stats, nil
				},
			}
			modelRepo := &mockModelRepo{
				listFn: func() ([]*entity.Model, error) {
					return mockModels, nil
				},
			}

			svc := NewReportService(reportRepo, modelRepo, nil, nil, logger)
			result, err := svc.GetByModel(context.Background(), time.Now().AddDate(0, 0, -7), time.Now())
			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}

			if len(result) != tt.wantLen {
				t.Errorf("got %d models, want %d", len(result), tt.wantLen)
			}

			if tt.wantLen > 0 && len(result) > 0 {
				if result[0].ModelName != tt.wantTop {
					t.Errorf("top model = %s, want %s", result[0].ModelName, tt.wantTop)
				}
				if result[0].Revenue != tt.wantTopRev {
					t.Errorf("top model revenue = %v, want %v", result[0].Revenue, tt.wantTopRev)
				}
			}
		})
	}
}

func TestReportService_GetUserUsageSummary(t *testing.T) {
	logger := slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelError}))

	tests := []struct {
		name        string
		todayRev    float64
		monthRev    float64
		historical  []*entity.BillingDailyStats
		wantToday   float64
		wantMonth   float64
		wantTotal   float64
	}{
		{
			name:      "有历史数据和今日数据",
			todayRev:  10.0,
			monthRev:  50.0,
			historical: []*entity.BillingDailyStats{
				{TotalRevenue: 100.0},
				{TotalRevenue: 200.0},
			},
			wantToday: 10.0,
			wantMonth: 50.0,
			wantTotal: 310.0, // 100 + 200 + 10
		},
		{
			name:      "仅有今日数据",
			todayRev:  5.0,
			monthRev:  0,
			historical: []*entity.BillingDailyStats{},
			wantToday: 5.0,
			wantMonth: 0,
			wantTotal: 5.0,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			reportRepo := &mockReportRepo{
				getUserTodaySummaryFn: func(userID int64) (float64, int, error) {
					return tt.todayRev, 0, nil
				},
				getCurrentMonthRevenueByUserFn: func(userID int64) (float64, int, error) {
					return tt.monthRev, 0, nil
				},
				getUserDailyStatsFn: func(userID int64, startDate, endDate time.Time) ([]*entity.BillingDailyStats, error) {
					return tt.historical, nil
				},
			}

			svc := NewReportService(reportRepo, nil, nil, nil, logger)
			summary, err := svc.GetUserUsageSummary(context.Background(), 1)
			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}

			if summary.TodayRevenue != tt.wantToday {
				t.Errorf("TodayRevenue = %v, want %v", summary.TodayRevenue, tt.wantToday)
			}
			if summary.MonthRevenue != tt.wantMonth {
				t.Errorf("MonthRevenue = %v, want %v", summary.MonthRevenue, tt.wantMonth)
			}
			if summary.TotalRevenue != tt.wantTotal {
				t.Errorf("TotalRevenue = %v, want %v", summary.TotalRevenue, tt.wantTotal)
			}
		})
	}
}

func TestParseDateRange(t *testing.T) {
	tests := []struct {
		name      string
		startDate string
		endDate   string
		wantStart string
		wantEnd   string
		wantErr   bool
	}{
		{
			name:      "自定义日期范围",
			startDate: "2026-07-01",
			endDate:   "2026-07-26",
			wantStart: "2026-07-01",
			wantEnd:   "2026-07-26",
			wantErr:   false,
		},
		{
			name:      "仅指定开始日期",
			startDate: "2026-07-01",
			endDate:   "",
			wantStart: "2026-07-01",
			wantErr:   false,
		},
		{
			name:      "无效日期格式",
			startDate: "2026/07/01",
			endDate:   "",
			wantErr:   true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			start, end, err := ParseDateRange(tt.startDate, tt.endDate)
			if tt.wantErr {
				if err == nil {
					t.Fatal("expected error but got none")
				}
				return
			}
			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}
			if tt.wantStart != "" && start.Format("2006-01-02") != tt.wantStart {
				t.Errorf("start = %v, want %v", start.Format("2006-01-02"), tt.wantStart)
			}
			if tt.wantEnd != "" && end.Format("2006-01-02") != tt.wantEnd {
				t.Errorf("end = %v, want %v", end.Format("2006-01-02"), tt.wantEnd)
			}
		})
	}
}

func TestReportService_GetRevenueTrend(t *testing.T) {
	logger := slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelError}))

	startDate := time.Date(2026, 7, 20, 0, 0, 0, 0, time.UTC)
	endDate := time.Date(2026, 7, 22, 0, 0, 0, 0, time.UTC)

	tests := []struct {
		name    string
		stats   []*entity.BillingDailyStats
		want    map[string]float64
		wantLen int
	}{
		{
			name: "三日趋势",
			stats: []*entity.BillingDailyStats{
				{StatDate: time.Date(2026, 7, 20, 0, 0, 0, 0, time.UTC), TotalRevenue: 100.0},
				{StatDate: time.Date(2026, 7, 21, 0, 0, 0, 0, time.UTC), TotalRevenue: 200.0},
				{StatDate: time.Date(2026, 7, 22, 0, 0, 0, 0, time.UTC), TotalRevenue: 150.0},
			},
			want: map[string]float64{
				"2026-07-20": 100.0,
				"2026-07-21": 200.0,
				"2026-07-22": 150.0,
			},
			wantLen: 3,
		},
		{
			name:  "部分日期有数据",
			stats: []*entity.BillingDailyStats{
				{StatDate: time.Date(2026, 7, 20, 0, 0, 0, 0, time.UTC), TotalRevenue: 100.0},
			},
			want: map[string]float64{
				"2026-07-20": 100.0,
				"2026-07-21": 0,
				"2026-07-22": 0,
			},
			wantLen: 3,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			reportRepo := &mockReportRepo{
				getDailyStatsFn: func(s, e time.Time) ([]*entity.BillingDailyStats, error) {
					return tt.stats, nil
				},
			}
			svc := NewReportService(reportRepo, nil, nil, nil, logger)

			points, err := svc.GetRevenueTrend(context.Background(), startDate, endDate)
			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}

			if len(points) != tt.wantLen {
				t.Errorf("got %d points, want %d", len(points), tt.wantLen)
			}

			for _, p := range points {
				wantRev, ok := tt.want[p.Date]
				if !ok {
					t.Errorf("unexpected date %s", p.Date)
					continue
				}
				if p.Revenue != wantRev {
					t.Errorf("date %s: revenue = %v, want %v", p.Date, p.Revenue, wantRev)
				}
			}
		})
	}
}
