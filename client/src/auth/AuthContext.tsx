import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import * as authApi from '../api/auth'
import { queryKeys } from '../api/queryKeys'
import { tokenStorage, UNAUTHORIZED_EVENT, authEvents } from '../api/tokenStorage'
import * as usersApi from '../api/users'
import { AuthContext, type AuthContextValue } from './authContextObject'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [hasToken, setHasToken] = useState(() => Boolean(tokenStorage.get()))
  const [sessionMessage, setSessionMessage] = useState<string | null>(null)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: queryKeys.me,
    queryFn: usersApi.getMe,
    enabled: hasToken,
    retry: false,
  })

  useEffect(() => {
    function handleUnauthorized() {
      setHasToken(false)
      setSessionMessage('Your session has expired. Please sign in again.')
      queryClient.removeQueries({ queryKey: queryKeys.me })
      navigate('/login', { replace: true })
    }
    authEvents.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized)
    return () => authEvents.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized)
  }, [navigate, queryClient])

  const login = useCallback(
    async (username: string, password: string) => {
      const { access_token } = await authApi.login(username, password)
      tokenStorage.set(access_token)
      setHasToken(true)
      await queryClient.invalidateQueries({ queryKey: queryKeys.me })
    },
    [queryClient],
  )

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      const { access_token } = await authApi.register(username, email, password)
      tokenStorage.set(access_token)
      setHasToken(true)
      await queryClient.invalidateQueries({ queryKey: queryKeys.me })
    },
    [queryClient],
  )

  const logout = useCallback(() => {
    tokenStorage.clear()
    setHasToken(false)
    queryClient.removeQueries({ queryKey: queryKeys.me })
    queryClient.clear()
    navigate('/login', { replace: true })
  }, [navigate, queryClient])

  const clearSessionMessage = useCallback(() => setSessionMessage(null), [])

  const value: AuthContextValue = {
    user: user ?? null,
    isAuthenticated: hasToken && Boolean(user),
    isLoadingUser: hasToken && isLoadingUser,
    sessionMessage,
    clearSessionMessage,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
