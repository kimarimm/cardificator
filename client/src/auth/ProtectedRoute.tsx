import { Navigate, Outlet, useLocation } from 'react-router-dom'
import CenteredSpinner from '../components/common/CenteredSpinner'
import { useAuth } from './useAuth'
import type { Role } from '../api/types'

interface ProtectedRouteProps {
  roles?: Role[]
}

export default function ProtectedRoute({ roles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoadingUser, user } = useAuth()
  const location = useLocation()

  if (isLoadingUser) {
    return <CenteredSpinner />
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
