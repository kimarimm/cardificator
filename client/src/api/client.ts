import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { emitUnauthorized, tokenStorage } from './tokenStorage'

export const apiClient = axios.create({
  baseURL: '/api',
})

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStorage.get()
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }
  return config
})

export function handleResponseError(error: AxiosError): Promise<never> {
  const hadToken = Boolean(error.config?.headers?.Authorization)
  if (error.response?.status === 401 && hadToken) {
    tokenStorage.clear()
    emitUnauthorized()
  }
  return Promise.reject(error)
}

apiClient.interceptors.response.use((response) => response, handleResponseError)

export function getErrorMessage(error: unknown, fallback = 'Something went wrong.'): string {
  if (axios.isAxiosError(error)) {
    const detail = (error.response?.data as { detail?: string } | undefined)?.detail
    if (typeof detail === 'string') {
      return detail
    }
  }
  return fallback
}
