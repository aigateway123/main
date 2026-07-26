import { httpClient } from './http'

export interface StudentResponse {
  userId: number
  email: string
  nickname: string
  status: string
  quotaBalance: number
  createdAt: string
}

export interface CreateStudentRequest {
  email: string
  password: string
  nickname: string
}

export interface ModelAccessResponse {
  modelId: number
  modelCode: string
  modelName: string
  enabled: boolean
}

export async function listStudents(params?: { keyword?: string; page?: number; pageSize?: number }): Promise<{ items: StudentResponse[]; total: number }> {
  const res = await httpClient.get('/api/v1/admin/users', { params })
  return res.data.data
}

export async function createStudent(data: CreateStudentRequest): Promise<void> {
  await httpClient.post('/api/v1/admin/users', data)
}

export async function updateStudentStatus(id: number, status: string): Promise<void> {
  await httpClient.put(`/api/v1/admin/users/${id}/status`, { status })
}

export async function getStudentQuota(id: number): Promise<{ quotaBalance: number }> {
  const res = await httpClient.get(`/api/v1/admin/users/${id}/quota`)
  return res.data.data
}

export async function setStudentQuota(id: number, amount: number): Promise<void> {
  await httpClient.put(`/api/v1/admin/users/${id}/quota`, { amount })
}

export async function getStudentModels(id: number): Promise<ModelAccessResponse[]> {
  const res = await httpClient.get(`/api/v1/admin/users/${id}/models`)
  return res.data.data
}

export async function setStudentModels(id: number, modelIds: number[]): Promise<void> {
  await httpClient.put(`/api/v1/admin/users/${id}/models`, { modelIds })
}
