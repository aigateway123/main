import { httpClient } from './http'

// 高峰时段（"HH:MM"，有序多组，最多 8 组；空数组 = 全天低谷价）
export interface TimeRange {
  start: string
  end: string
}

export interface PricingResponse {
  modelId: number
  modelCode: string
  modelName: string
  pricingType: string
  pricingStatus?: string  // "pending" | "active"
  pricingUnit?: 'token' | 'image_count' | 'request' | 'per_million_tokens'
  unitPrice?: Record<string, unknown>
  pricePerInputToken?: number
  pricePerOutputToken?: number
  peakStart?: string
  peakEnd?: string
  peakRanges?: TimeRange[]
  peakPricePerInputToken?: number
  peakPricePerOutputToken?: number
  offPeakPricePerInputToken?: number
  offPeakPricePerOutputToken?: number
}

export interface UpdatePricingRequest {
  pricingType?: string
  pricingUnit?: string
  unitPrice?: Record<string, unknown>
  pricePerInputToken?: number
  pricePerOutputToken?: number
  peakStart?: string
  peakEnd?: string
  peakRanges?: TimeRange[]  // 新增：多组高峰时段（权威数据源）；旧字段 peakStart/peakEnd 不再提交
  peakPricePerInputToken?: number
  peakPricePerOutputToken?: number
  offPeakPricePerInputToken?: number
  offPeakPricePerOutputToken?: number
  pricingStatus?: string
  currency?: string
}

export async function listPricing(): Promise<PricingResponse[]> {
  const res = await httpClient.get('/api/v1/admin/pricing')
  return res.data.data
}

export async function getPricing(modelId: number): Promise<PricingResponse> {
  const res = await httpClient.get(`/api/v1/admin/pricing/model/${modelId}`)
  return res.data.data
}

export async function updatePricing(modelId: number, data: UpdatePricingRequest): Promise<void> {
  await httpClient.put(`/api/v1/admin/pricing/model/${modelId}`, data)
}

export interface PricingTemplate {
  providerName: string
  modelCode: string
  suggestedInputPrice: number
  suggestedOutputPrice: number
  pricingType: string
}

export async function getPricingTemplates(): Promise<PricingTemplate[]> {
  const res = await httpClient.get('/api/v1/admin/pricing/templates')
  return res.data.data
}
