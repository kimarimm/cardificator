import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import type { User } from '../api/types'
import ProtectedRoute from './ProtectedRoute'
import { useAuth } from './useAuth'

vi.mock('./useAuth')

function renderAt(path: string, roles?: Array<User['role']>) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/login" element={<div>Login page</div>} />
        <Route path="/" element={<div>Home page</div>} />
        <Route element={<ProtectedRoute roles={roles} />}>
          <Route path="/secret" element={<div>Secret content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

function mockAuth(overrides: Partial<ReturnType<typeof useAuth>>) {
  vi.mocked(useAuth).mockReturnValue({
    user: null,
    isAuthenticated: false,
    isLoadingUser: false,
    sessionMessage: null,
    clearSessionMessage: vi.fn(),
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    ...overrides,
  })
}

describe('ProtectedRoute', () => {
  it('redirects to /login when not authenticated', () => {
    mockAuth({ isAuthenticated: false, user: null })
    renderAt('/secret')
    expect(screen.getByText('Login page')).toBeInTheDocument()
  })

  it('shows a spinner while the user is loading', () => {
    mockAuth({ isLoadingUser: true })
    renderAt('/secret')
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('renders the route for an authenticated user with no role restriction', () => {
    const user: User = { id: 1, username: 'alice', email: 'alice@example.com', role: 'user' }
    mockAuth({ isAuthenticated: true, user })
    renderAt('/secret')
    expect(screen.getByText('Secret content')).toBeInTheDocument()
  })

  it('redirects a user without the required role to the home page', () => {
    const user: User = { id: 1, username: 'alice', email: 'alice@example.com', role: 'user' }
    mockAuth({ isAuthenticated: true, user })
    renderAt('/secret', ['administrator'])
    expect(screen.getByText('Home page')).toBeInTheDocument()
  })

  it('renders the route for a user with the required role', () => {
    const user: User = { id: 1, username: 'admin', email: 'admin@example.com', role: 'administrator' }
    mockAuth({ isAuthenticated: true, user })
    renderAt('/secret', ['administrator'])
    expect(screen.getByText('Secret content')).toBeInTheDocument()
  })
})
