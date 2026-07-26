import { httpClient } from './http'

export interface QuotaResponse {
  quotaBalance: number
  totalQuota: number
  usedQuota: number
}

export interface UsageRecord {
  id: number
  userId: number
  email: string
  modelCode: string
  modelName: string
  inputTokens: number
  outputTokens: number
  costAmount: number
  requestStatus: string
  createdAt: string
}

export interface AdminBillingSummary {
  totalUsers: number
  activeUsers: number
  todayRequests: number
  todayCost: number
  totalCost: number
}

export async function getMyQuota(): Promise<QuotaResponse> {
  const res = await httpClient.get('/api/v1/billing/quota')
  return res.data.data
}

export async function getMyUsage(params?: { page?: number; pageSize?: number }): Promise<{ items: UsageRecord[]; total: number }> {
  const res = await httpClient.get('/api/v1/billing/usage', { params })
  return res.data.data
}

export async function getAdminBillingSummary(): Promise<AdminBillingSummary> {
  const res = await httpClient.get('/api/v1/admin/billing/summary')
  return res.data.data
}

export async function getAdminBillingUsage(params?: { userId?: number; startDate?: string; endDate?: string; status?: string; page?: number; pageSize?: number }): Promise<{ items: UsageRecord[]; total: number }> {
  const res = await httpClient.get('/api/v1/admin/billing/usage', { params })
  return res.data.data
}
