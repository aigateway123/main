import { httpClient } from './http'

export interface ApiKeyResponse {
  id: number
  userId: number
  keyPrefix: string
  fullKey?: string
  permissionScope: string
  keyStatus: string
  createdAt: string
}

export async function createApiKeyApi(permissionScope: string = 'default'): Promise<ApiKeyResponse> {
  const res = await httpClient.post('/api/v1/api-keys', { permissionScope })
  return res.data.data
}

export async function listApiKeysApi(): Promise<ApiKeyResponse[]> {
  const res = await httpClient.get('/api/v1/api-keys')
  return res.data.data
}

export async function revokeApiKeyApi(id: number): Promise<void> {
  await httpClient.patch(`/api/v1/api-keys/${id}/revoke`)
}
