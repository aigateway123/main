import { httpClient } from './http'

export interface ModelResponse {
  id: number
  modelName: string
  modelCode: string
  modelStatus: string
  modelType: 'chat' | 'image' | 'embedding'
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

export interface ModelDetailResponse {
  model: ModelResponse
  providers: Array<{
    id: number
    providerName: string
    baseUrl: string
    priority: number
    weight: number
    isEnabledFlag: boolean
    createdAt: string
    updatedAt: string
  }>
}

export interface CreateModelRequest {
  modelName: string
  modelCode: string
  modelType?: string
  isPublic?: boolean
}

export interface UpdateModelRequest {
  modelName?: string
  modelCode?: string
  modelStatus?: string
  modelType?: string
  isPublic?: boolean
}

export interface BindProviderRequest {
  providerId: number
  weight: number
  apiPathOverride?: string
}

export async function listModelsApi(modelType?: string): Promise<ModelResponse[]> {
  const params: Record<string, string> = {}
  if (modelType) params.modelType = modelType
  const res = await httpClient.get('/api/v1/models', { params })
  return res.data.data
}

export async function getModelApi(id: number): Promise<ModelDetailResponse> {
  const res = await httpClient.get(`/api/v1/models/${id}`)
  return res.data.data
}

export async function createModelApi(data: CreateModelRequest): Promise<ModelResponse> {
  const res = await httpClient.post('/api/v1/models', data)
  return res.data.data
}

export async function updateModelApi(id: number, data: UpdateModelRequest): Promise<ModelResponse> {
  const res = await httpClient.put(`/api/v1/models/${id}`, data)
  return res.data.data
}

export async function deleteModelApi(id: number): Promise<void> {
  await httpClient.delete(`/api/v1/models/${id}`)
}

export async function bindProviderApi(modelId: number, data: BindProviderRequest): Promise<void> {
  await httpClient.post(`/api/v1/models/${modelId}/bind`, data)
}

export async function unbindProviderApi(bindingId: number): Promise<void> {
  await httpClient.delete(`/api/v1/bindings/${bindingId}`)
}
