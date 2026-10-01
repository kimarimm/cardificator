import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as libraryApi from '../api/library'
import { queryKeys } from '../api/queryKeys'

export function useLibrary() {
  return useQuery({ queryKey: queryKeys.library, queryFn: libraryApi.listLibrary })
}

export function useAddToLibrary() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ cardId, linkToken }: { cardId: number; linkToken?: string }) =>
      libraryApi.addToLibrary(cardId, linkToken),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.library }),
  })
}

export function useRemoveFromLibrary() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (cardId: number) => libraryApi.removeFromLibrary(cardId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.library }),
  })
}
