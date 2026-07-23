import { httpClient } from './http'

export interface AuthResponse {
  userId: number
  email: string
  nickname: string
  accessToken: string
  refreshToken?: string
}

export interface RegisterRequest {
  email: string
  password: string
  nickname: string
}

export interface LoginRequest {
  email: string
  password: string
}

export async function registerApi(data: RegisterRequest): Promise<AuthResponse> {
  const res = await httpClient.post('/api/v1/auth/register', data)
  return res.data.data
}

export async function loginApi(data: LoginRequest): Promise<AuthResponse> {
  const res = await httpClient.post('/api/v1/auth/login', data)
  return res.data.data
}

export async function getProfileApi(): Promise<{ userId: number; email: string; nickname: string }> {
  const res = await httpClient.get('/api/v1/auth/profile')
  return res.data.data
}
