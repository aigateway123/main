import { httpClient } from './http'

export interface PricingResponse {
  modelId: number
  modelCode: string
  modelName: string
  pricingType: string
  pricingStatus?: string  // "pending" | "active"
  pricingUnit?: 'token' | 'image_count' | 'request'
  unitPrice?: Record<string, unknown>
  pricePerInputToken?: number
  pricePerOutputToken?: number
  peakStart?: string
  peakEnd?: string
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
