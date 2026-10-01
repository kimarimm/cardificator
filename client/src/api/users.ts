import { apiClient } from './client'
import type { Role, User } from './types'

export async function getMe() {
  const { data } = await apiClient.get<User>('/users/me')
  return data
}

export async function listUsers() {
  const { data } = await apiClient.get<User[]>('/admin/users')
  return data
}

export async function updateUserRole(userId: number, role: Role) {
  const { data } = await apiClient.patch<User>(`/admin/users/${userId}/role`, { role })
  return data
}
