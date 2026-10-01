import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
} from '@mui/material'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import type { CardSetDetail } from '../../api/types'
import { cardSetSchema, type CardSetFormValues } from '../../validation/schemas'

interface SetFormDialogProps {
  open: boolean
  cardSet?: CardSetDetail | null
  onSubmit: (values: CardSetFormValues) => Promise<void>
  onClose: () => void
}

const emptyValues: CardSetFormValues = { name: '', description: '', is_public: false }

export default function SetFormDialog({ open, cardSet, onSubmit, onClose }: SetFormDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CardSetFormValues>({
    resolver: zodResolver(cardSetSchema),
    defaultValues: emptyValues,
  })

  useEffect(() => {
    if (open) {
      reset(
        cardSet
          ? { name: cardSet.name, description: cardSet.description, is_public: cardSet.is_public }
          : emptyValues,
      )
    }
  }, [open, cardSet, reset])

  const submit = handleSubmit(async (values) => {
    await onSubmit(values)
  })

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{cardSet ? 'Edit card set' : 'New card set'}</DialogTitle>
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
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Description" error={!!errors.description} helperText={errors.description?.message} fullWidth multiline minRows={2} />
              )}
            />
            <Controller
              name="is_public"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />}
                  label="Public (discoverable by anyone)"
                />
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
