import { apiClient } from './client'
import type { TokenResponse } from './types'

export async function register(username: string, email: string, password: string) {
  const { data } = await apiClient.post<TokenResponse>('/auth/register', {
    username,
    email,
    password,
  })
  return data
}

export async function login(username: string, password: string) {
  const form = new URLSearchParams()
  form.set('username', username)
  form.set('password', password)
  const { data } = await apiClient.post<TokenResponse>('/auth/login', form, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  return data
}
