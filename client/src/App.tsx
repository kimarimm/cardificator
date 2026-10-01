import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './auth/ProtectedRoute'
import AppLayout from './components/layout/AppLayout'
import CenteredSpinner from './components/common/CenteredSpinner'

const LandingPage = lazy(() => import('./pages/LandingPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const SignUpPage = lazy(() => import('./pages/SignUpPage'))
const PublicSetsPage = lazy(() => import('./pages/PublicSetsPage'))
const LibraryPage = lazy(() => import('./pages/LibraryPage'))
const CollectPage = lazy(() => import('./pages/CollectPage'))
const MySetsPage = lazy(() => import('./pages/MySetsPage'))
const SetEditorPage = lazy(() => import('./pages/SetEditorPage'))
const AdminUsersPage = lazy(() => import('./pages/AdminUsersPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

export default function App() {
  return (
    <Suspense fallback={<CenteredSpinner />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        <Route element={<AppLayout />}>
          <Route element={<ProtectedRoute />}>
            <Route path="/sets/public" element={<PublicSetsPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/collect/:token" element={<CollectPage />} />
          </Route>

          <Route element={<ProtectedRoute roles={['creator', 'administrator']} />}>
            <Route path="/sets/mine" element={<MySetsPage />} />
            <Route path="/sets/mine/:setId" element={<SetEditorPage />} />
          </Route>

          <Route element={<ProtectedRoute roles={['administrator']} />}>
            <Route path="/admin/users" element={<AdminUsersPage />} />
          </Route>
        </Route>

        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  )
}
