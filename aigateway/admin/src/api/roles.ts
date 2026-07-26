import { httpClient } from './http'

export interface RoleResponse {
  id: number
  name: string
  description: string
  permissionCount?: number
  userCount?: number
  isSystem?: boolean
  createdAt: string
}

export interface CreateRoleRequest {
  name: string
  description: string
}

export interface PermissionResponse {
  id: number
  code: string
  name: string
  description?: string
  group?: string
}

export async function listRoles(): Promise<RoleResponse[]> {
  const res = await httpClient.get('/api/v1/admin/roles')
  return res.data.data
}

export async function createRole(data: CreateRoleRequest): Promise<void> {
  await httpClient.post('/api/v1/admin/roles', data)
}

export async function getRole(id: number): Promise<RoleResponse & { permissions: PermissionResponse[] }> {
  const res = await httpClient.get(`/api/v1/admin/roles/${id}`)
  return res.data.data
}

export async function updateRole(id: number, data: Partial<CreateRoleRequest>): Promise<void> {
  await httpClient.put(`/api/v1/admin/roles/${id}`, data)
}

export async function deleteRole(id: number): Promise<void> {
  await httpClient.delete(`/api/v1/admin/roles/${id}`)
}

export async function updateRolePermissions(id: number, permissionIds: number[]): Promise<void> {
  await httpClient.put(`/api/v1/admin/roles/${id}/permissions`, { permissionIds })
}

export async function listPermissions(): Promise<PermissionResponse[]> {
  const res = await httpClient.get('/api/v1/admin/permissions')
  return res.data.data
}
