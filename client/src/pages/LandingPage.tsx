import { Box, Button, Container, Stack, Typography } from '@mui/material'
import { Navigate, Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import heroImage from '../assets/hero.png'

export default function LandingPage() {
  const { isAuthenticated, isLoadingUser } = useAuth()

  if (!isLoadingUser && isAuthenticated) {
    return <Navigate to="/sets/public" replace />
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Stack spacing={4} sx={{ alignItems: 'center', textAlign: 'center' }}>
        <Box
          component="img"
          src={heroImage}
          alt=""
          sx={{ width: '100%', maxWidth: 360, borderRadius: 2 }}
        />
        <Typography variant="h3" component="h1" sx={{ fontWeight: 700 }}>
          Cardificator
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 560 }}>
          Collect cards from public and shared sets, and build your own library. Creators can
          mint sets and share a secret link; administrators manage everyone's roles.
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button component={RouterLink} to="/login" variant="contained" size="large">
            Sign in
          </Button>
          <Button component={RouterLink} to="/signup" variant="outlined" size="large">
            Create an account
          </Button>
        </Stack>
      </Stack>
    </Container>
  )
}
