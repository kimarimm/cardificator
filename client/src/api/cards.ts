import { apiClient } from './client'
import type { Card, CardInput } from './types'

export async function listCards(setId: number) {
  const { data } = await apiClient.get<Card[]>(`/sets/${setId}/cards`)
  return data
}

export async function createCard(setId: number, input: CardInput) {
  const { data } = await apiClient.post<Card>(`/sets/${setId}/cards`, input)
  return data
}

export async function updateCard(setId: number, cardId: number, input: Partial<CardInput>) {
  const { data } = await apiClient.patch<Card>(`/sets/${setId}/cards/${cardId}`, input)
  return data
}

export async function deleteCard(setId: number, cardId: number) {
  await apiClient.delete(`/sets/${setId}/cards/${cardId}`)
}
