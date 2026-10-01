import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Container, Link, Paper, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import { getErrorMessage } from '../api/client'
import { useAuth } from '../auth/useAuth'
import ErrorAlert from '../components/common/ErrorAlert'
import { loginSchema, type LoginFormValues } from '../validation/schemas'

export default function LoginPage() {
  const { login, sessionMessage, clearSessionMessage } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  })

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/sets/public'

  const onSubmit = handleSubmit(async (values) => {
    setError(null)
    try {
      await login(values.username, values.password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(getErrorMessage(err, 'Invalid username or password.'))
    }
  })

  return (
    <Container maxWidth="xs" sx={{ py: 8 }}>
      <Paper variant="outlined" sx={{ p: 4 }}>
        <Typography variant="h5" component="h1" sx={{ mb: 3, fontWeight: 700 }}>
          Sign in
        </Typography>
        <ErrorAlert message={error ?? sessionMessage} />
        <form onSubmit={onSubmit} onFocus={clearSessionMessage}>
          <Stack spacing={2}>
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Username" error={!!errors.username} helperText={errors.username?.message} autoFocus fullWidth />
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Password" type="password" error={!!errors.password} helperText={errors.password?.message} fullWidth />
              )}
            />
            <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
              Sign in
            </Button>
          </Stack>
        </form>
        <Typography variant="body2" sx={{ mt: 3 }}>
          No account yet? <Link component={RouterLink} to="/signup">Create one</Link>
        </Typography>
      </Paper>
    </Container>
  )
}
