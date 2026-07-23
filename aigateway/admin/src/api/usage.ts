import { httpClient } from './http'

export interface DashboardStats {
  todayRequests: number
  todayTokens: number
  todayCost: number
  totalRequests: number
  totalTokens: number
  totalCost: number
  averageLatency: number
  activeApiKeys: number
  activeProviders: number
}

export interface RequestLogEntry {
  id: number
  modelCode: string
  providerName: string
  inputTokens: number
  outputTokens: number
  latencyMs: number
  costAmount: number
  requestStatus: string
  createdAt: string
}

export interface PaginatedLogs {
  items: RequestLogEntry[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

export async function getDashboardApi(): Promise<DashboardStats> {
  const res = await httpClient.get('/api/v1/dashboard')
  return res.data.data
}

export async function getRecentLogsApi(): Promise<RequestLogEntry[]> {
  const res = await httpClient.get('/api/v1/dashboard/recent-logs')
  return res.data.data
}

export async function listLogsApi(page: number = 1, pageSize: number = 20): Promise<PaginatedLogs> {
  const res = await httpClient.get('/api/v1/usage/logs', { params: { page, pageSize } })
  return res.data.data
}
