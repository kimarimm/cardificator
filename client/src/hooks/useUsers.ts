import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as usersApi from '../api/users'
import { queryKeys } from '../api/queryKeys'
import type { Role } from '../api/types'

export function useUsers() {
  return useQuery({ queryKey: queryKeys.users, queryFn: usersApi.listUsers })
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, role }: { userId: number; role: Role }) => usersApi.updateUserRole(userId, role),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.users }),
  })
}
