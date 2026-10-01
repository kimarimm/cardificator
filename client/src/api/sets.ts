import { apiClient } from './client'
import type { CardSetDetail, CardSetInput, CardSetWithCards } from './types'

export async function listMySets() {
  const { data } = await apiClient.get<CardSetDetail[]>('/sets')
  return data
}

export async function listPublicSets() {
  const { data } = await apiClient.get<CardSetWithCards[]>('/sets/public')
  return data
}

export async function getSetByLink(token: string) {
  const { data } = await apiClient.get<CardSetWithCards>(`/sets/by-link/${token}`)
  return data
}

export async function getSet(setId: number) {
  const { data } = await apiClient.get<CardSetDetail>(`/sets/${setId}`)
  return data
}

export async function createSet(input: CardSetInput) {
  const { data } = await apiClient.post<CardSetDetail>('/sets', input)
  return data
}

export async function updateSet(setId: number, input: Partial<CardSetInput>) {
  const { data } = await apiClient.patch<CardSetDetail>(`/sets/${setId}`, input)
  return data
}

export async function deleteSet(setId: number) {
  await apiClient.delete(`/sets/${setId}`)
}

export async function regenerateLink(setId: number) {
  const { data } = await apiClient.post<CardSetDetail>(`/sets/${setId}/link/regenerate`)
  return data
}
