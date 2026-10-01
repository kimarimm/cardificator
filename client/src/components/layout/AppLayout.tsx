import {
  AppBar,
  Box,
  Button,
  Container,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material'
import type { CSSProperties } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../auth/useAuth'

function navLinkStyle({ isActive }: { isActive: boolean }): CSSProperties {
  return {
    color: 'inherit',
    textDecoration: 'none',
    fontWeight: isActive ? 700 : 400,
    opacity: isActive ? 1 : 0.85,
  }
}

export default function AppLayout() {
  const { user, logout } = useAuth()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar sx={{ gap: 3 }}>
          <Typography
            variant="h6"
            component={NavLink}
            to="/"
            sx={{ color: 'inherit', textDecoration: 'none', mr: 2 }}
          >
            Cardificator
          </Typography>
          <Stack direction="row" spacing={3} sx={{ flexGrow: 1 }}>
            <NavLink to="/sets/public" style={navLinkStyle}>
              Browse sets
            </NavLink>
            <NavLink to="/library" style={navLinkStyle}>
              My library
            </NavLink>
            {(user?.role === 'creator' || user?.role === 'administrator') && (
              <NavLink to="/sets/mine" style={navLinkStyle}>
                My sets
              </NavLink>
            )}
            {user?.role === 'administrator' && (
              <NavLink to="/admin/users" style={navLinkStyle}>
                Users
              </NavLink>
            )}
          </Stack>
          {user && (
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
              <Typography variant="body2">{user.username}</Typography>
              <Button color="inherit" variant="outlined" size="small" onClick={logout}>
                Sign out
              </Button>
            </Stack>
          )}
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ flexGrow: 1, py: 4 }} maxWidth="lg">
        <Outlet />
      </Container>
    </Box>
  )
}
