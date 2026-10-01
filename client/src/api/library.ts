import { apiClient } from './client'
import type { LibraryEntry } from './types'

export async function listLibrary() {
  const { data } = await apiClient.get<LibraryEntry[]>('/library')
  return data
}

export async function addToLibrary(cardId: number, linkToken?: string) {
  const { data } = await apiClient.post<LibraryEntry>('/library', {
    card_id: cardId,
    link_token: linkToken,
  })
  return data
}

export async function removeFromLibrary(cardId: number) {
  await apiClient.delete(`/library/${cardId}`)
}
