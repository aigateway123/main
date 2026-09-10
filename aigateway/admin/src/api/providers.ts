import { httpClient } from './http'

export interface ProviderResponse {
  id: number
  providerName: string
  baseUrl: string
  apiKeyRef?: string
  apiPath: string
  protocolType: string
  authType: string
  // Anthropic 协议端点（可选）
  anthropicBaseUrl?: string
  anthropicApiPath?: string
  anthropicApiKeyRef?: string
  anthropicAuthType?: string
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
  protocolType?: string
  authType?: string
  // Anthropic 协议端点（可选）
  anthropicBaseUrl?: string
  anthropicApiPath?: string
  anthropicApiKeyRef?: string
  anthropicAuthType?: string
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

export interface TestEndpointRequest {
  protocol: string
  baseUrl: string
  apiPath?: string
  authType?: string
  apiKeyRef?: string
}

export interface TestEndpointResponse {
  reachable: boolean
  authOk: boolean
  statusCode: number
  latencyMs: number
  message: string
}

export async function testProviderEndpointApi(data: TestEndpointRequest): Promise<TestEndpointResponse> {
  const res = await httpClient.post('/api/v1/providers/test-endpoint', data)
  return res.data.data
}
