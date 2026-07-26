import { httpClient } from './http'

/* ========== Types ========== */

/** Admin 报表 — 费用总览 */
export interface ReportSummary {
  today: {
    revenue: number
    requestCount: number
    inputTokens: number
    outputTokens: number
  }
  currentMonth: {
    revenue: number
    requestCount: number
    inputTokens: number
    outputTokens: number
  }
}

/** Admin 报表 — 每日收入趋势 */
export interface DailyRevenue {
  date: string
  revenue: number
  requestCount: number
}

/** Admin 报表 — 模型排行 */
export interface ModelRevenue {
  modelCode: string
  modelName: string
  requestCount: number
  inputTokens: number
  outputTokens: number
  totalRevenue: number
}

/** Admin 报表 — 用户排行 */
export interface UserRevenue {
  userId: number
  email: string
  requestCount: number
  totalRevenue: number
}

/** 学生 — 个人消费总览 */
export interface MyUsageSummary {
  todayRevenue: number
  monthRevenue: number
  totalRevenue: number
}

/** 学生 — 个人消费趋势 */
export interface MyDailyUsage {
  date: string
  revenue: number
  requestCount: number
}

/** 学生 — 消费明细 */
export interface UsageDetailItem {
  id: number
  modelCode: string
  modelName: string
  inputTokens: number
  outputTokens: number
  costAmount: number
  createdAt: string
}

export interface UsageDetailPagination {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface UsageDetailResponse {
  items: UsageDetailItem[]
  pagination: UsageDetailPagination
}

/** 时间范围类型 */
export type ReportRange = 'today' | 'yesterday' | '7d' | 'month'

/* ========== Admin 报表 API ========== */

/**
 * 费用总览
 * GET /api/v1/billing/report/summary?range=
 */
export async function getReportSummary(range: ReportRange = 'today'): Promise<ReportSummary> {
  const res = await httpClient.get('/api/v1/billing/report/summary', { params: { range } })
  return res.data.data
}

/**
 * 收入趋势
 * GET /api/v1/billing/report/revenue-trend?range=
 */
export async function getRevenueTrend(range: ReportRange | string = '7d'): Promise<DailyRevenue[]> {
  const res = await httpClient.get('/api/v1/billing/report/revenue-trend', { params: { range } })
  return res.data.data.dailyRevenue ?? res.data.data
}

/**
 * 模型排行
 * GET /api/v1/billing/report/by-model?range=
 */
export async function getReportByModel(range: ReportRange | string = 'month'): Promise<ModelRevenue[]> {
  const res = await httpClient.get('/api/v1/billing/report/by-model', { params: { range } })
  return res.data.data
}

/**
 * 用户排行
 * GET /api/v1/billing/report/by-user?range=
 */
export async function getReportByUser(range: ReportRange | string = 'month'): Promise<UserRevenue[]> {
  const res = await httpClient.get('/api/v1/billing/report/by-user', { params: { range } })
  return res.data.data
}

/**
 * 导出 CSV
 * GET /api/v1/billing/report/export?start=&end=
 */
export async function exportReportCsv(start: string, end: string): Promise<void> {
  const token = localStorage.getItem('admin_access_token')
  const baseUrl = (httpClient.defaults.baseURL ?? '').replace(/\/+$/, '')
  const url = `${baseUrl}/api/v1/billing/report/export?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`

  const resp = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!resp.ok) throw new Error('导出失败')

  const blob = await resp.blob()
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `billing-report-${start}-${end}.csv`
  link.click()
  URL.revokeObjectURL(link.href)
}

/* ========== 学生个人 API ========== */

/**
 * 个人消费总览
 * GET /api/v1/billing/my/usage-summary
 */
export async function getMyUsageSummary(): Promise<MyUsageSummary> {
  const res = await httpClient.get('/api/v1/billing/my/usage-summary')
  return res.data.data
}

/**
 * 个人消费趋势
 * GET /api/v1/billing/my/usage-trend?days=
 */
export async function getMyUsageTrend(days: number = 7): Promise<MyDailyUsage[]> {
  const res = await httpClient.get('/api/v1/billing/my/usage-trend', { params: { days } })
  return res.data.data
}

/**
 * 个人消费明细
 * GET /api/v1/billing/my/usage-detail?page=&pageSize=
 */
export async function getMyUsageDetail(params?: {
  page?: number
  pageSize?: number
  startDate?: string
  endDate?: string
}): Promise<UsageDetailResponse> {
  const res = await httpClient.get('/api/v1/billing/my/usage-detail', { params })
  return res.data.data
}
