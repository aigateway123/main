import { httpClient } from './http'

export interface ProviderResponse {
  id: number
  providerName: string
  baseUrl: string
  apiKeyRef?: string
  apiPath: string
  priority: number
  weight: number
  isEnabledFlag: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateProviderRequest {
  providerName: string
  baseUrl: string
  apiKeyRef?: string
  apiPath?: string
  priority?: number
  weight?: number
  isEnabledFlag?: boolean
}

export type UpdateProviderRequest = CreateProviderRequest

export async function listProvidersApi(): Promise<ProviderResponse[]> {
  const res = await httpClient.get('/api/v1/providers')
  return res.data.data
}

export async function getProviderApi(id: number): Promise<ProviderResponse> {
  const res = await httpClient.get(`/api/v1/providers/${id}`)
  return res.data.data
}

export async function createProviderApi(data: CreateProviderRequest): Promise<ProviderResponse> {
  const res = await httpClient.post('/api/v1/providers', data)
  return res.data.data
}

export async function updateProviderApi(id: number, data: UpdateProviderRequest): Promise<ProviderResponse> {
  const res = await httpClient.put(`/api/v1/providers/${id}`, data)
  return res.data.data
}

export async function deleteProviderApi(id: number): Promise<void> {
  await httpClient.delete(`/api/v1/providers/${id}`)
}
