import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import type { Card } from '../../api/types'
import { cardSchema, type CardFormValues } from '../../validation/schemas'

interface CardFormDialogProps {
  open: boolean
  card?: Card | null
  onSubmit: (values: CardFormValues) => Promise<void>
  onClose: () => void
}

const emptyValues: CardFormValues = { name: '', symbol: '', color: '#2196F3', description: '' }

export default function CardFormDialog({ open, card, onSubmit, onClose }: CardFormDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CardFormValues>({
    resolver: zodResolver(cardSchema),
    defaultValues: emptyValues,
  })

  useEffect(() => {
    if (open) {
      reset(card ? { name: card.name, symbol: card.symbol, color: card.color, description: card.description } : emptyValues)
    }
  }, [open, card, reset])

  const submit = handleSubmit(async (values) => {
    await onSubmit(values)
  })

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{card ? 'Edit card' : 'New card'}</DialogTitle>
      <form onSubmit={submit}>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Name" error={!!errors.name} helperText={errors.name?.message} fullWidth autoFocus />
              )}
            />
            <Stack direction="row" spacing={2}>
              <Controller
                name="symbol"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Symbol" error={!!errors.symbol} helperText={errors.symbol?.message ?? 'A unicode symbol or emoji'} sx={{ flex: 1 }} />
                )}
              />
              <Controller
                name="color"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Color"
                    type="color"
                    error={!!errors.color}
                    helperText={errors.color?.message}
                    sx={{ width: 120 }}
                  />
                )}
              />
            </Stack>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Description" error={!!errors.description} helperText={errors.description?.message} fullWidth multiline minRows={2} />
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
