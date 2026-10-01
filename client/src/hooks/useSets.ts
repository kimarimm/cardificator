import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as setsApi from '../api/sets'
import { queryKeys } from '../api/queryKeys'
import type { CardSetInput } from '../api/types'

export function useMySets() {
  return useQuery({ queryKey: queryKeys.mySets, queryFn: setsApi.listMySets })
}

export function usePublicSets() {
  return useQuery({ queryKey: queryKeys.publicSets, queryFn: setsApi.listPublicSets })
}

export function useSetByLink(token: string) {
  return useQuery({
    queryKey: queryKeys.setByLink(token),
    queryFn: () => setsApi.getSetByLink(token),
    enabled: Boolean(token),
  })
}

export function useSet(setId: number) {
  return useQuery({ queryKey: queryKeys.set(setId), queryFn: () => setsApi.getSet(setId) })
}

export function useCreateSet() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CardSetInput) => setsApi.createSet(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.mySets }),
  })
}

export function useUpdateSet(setId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: Partial<CardSetInput>) => setsApi.updateSet(setId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.mySets })
      queryClient.invalidateQueries({ queryKey: queryKeys.set(setId) })
    },
  })
}

export function useDeleteSet() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (setId: number) => setsApi.deleteSet(setId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.mySets }),
  })
}

export function useRegenerateLink(setId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => setsApi.regenerateLink(setId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.set(setId) }),
  })
}
