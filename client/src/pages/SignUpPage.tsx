import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Container, Link, Paper, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { getErrorMessage } from '../api/client'
import { useAuth } from '../auth/useAuth'
import ErrorAlert from '../components/common/ErrorAlert'
import { registerSchema, type RegisterFormValues } from '../validation/schemas'

export default function SignUpPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: '', email: '', password: '' },
  })

  const onSubmit = handleSubmit(async (values) => {
    setError(null)
    try {
      await register(values.username, values.email, values.password)
      navigate('/sets/public', { replace: true })
    } catch (err) {
      setError(getErrorMessage(err, 'Could not create your account.'))
    }
  })

  return (
    <Container maxWidth="xs" sx={{ py: 8 }}>
      <Paper variant="outlined" sx={{ p: 4 }}>
        <Typography variant="h5" component="h1" sx={{ mb: 3, fontWeight: 700 }}>
          Create an account
        </Typography>
        <ErrorAlert message={error} />
        <form onSubmit={onSubmit}>
          <Stack spacing={2}>
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Username" error={!!errors.username} helperText={errors.username?.message} autoFocus fullWidth />
              )}
            />
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Email" type="email" error={!!errors.email} helperText={errors.email?.message} fullWidth />
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Password" type="password" error={!!errors.password} helperText={errors.password?.message ?? 'At least 8 characters'} fullWidth />
              )}
            />
            <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
              Sign up
            </Button>
          </Stack>
        </form>
        <Typography variant="body2" sx={{ mt: 3 }}>
          Already have an account? <Link component={RouterLink} to="/login">Sign in</Link>
        </Typography>
      </Paper>
    </Container>
  )
}
