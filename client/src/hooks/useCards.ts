import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as cardsApi from '../api/cards'
import { queryKeys } from '../api/queryKeys'
import type { CardInput } from '../api/types'

export function useCards(setId: number) {
  return useQuery({ queryKey: queryKeys.cards(setId), queryFn: () => cardsApi.listCards(setId) })
}

export function useCreateCard(setId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CardInput) => cardsApi.createCard(setId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.cards(setId) }),
  })
}

export function useUpdateCard(setId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ cardId, input }: { cardId: number; input: Partial<CardInput> }) =>
      cardsApi.updateCard(setId, cardId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.cards(setId) }),
  })
}

export function useDeleteCard(setId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (cardId: number) => cardsApi.deleteCard(setId, cardId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.cards(setId) }),
  })
}
