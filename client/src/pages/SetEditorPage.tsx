import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import {
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getErrorMessage } from '../api/client'
import type { Card } from '../api/types'
import CardFormDialog from '../components/cards/CardFormDialog'
import CardTile from '../components/cards/CardTile'
import CenteredSpinner from '../components/common/CenteredSpinner'
import ConfirmDialog from '../components/common/ConfirmDialog'
import ErrorAlert from '../components/common/ErrorAlert'
import SetFormDialog from '../components/sets/SetFormDialog'
import { useCards, useCreateCard, useDeleteCard, useUpdateCard } from '../hooks/useCards'
import { useRegenerateLink, useSet, useUpdateSet } from '../hooks/useSets'
import type { CardFormValues, CardSetFormValues } from '../validation/schemas'

export default function SetEditorPage() {
  const { setId } = useParams<{ setId: string }>()
  const id = Number(setId)
  const navigate = useNavigate()

  const setQuery = useSet(id)
  const cardsQuery = useCards(id)
  const updateSetMutation = useUpdateSet(id)
  const regenerateLinkMutation = useRegenerateLink(id)
  const createCardMutation = useCreateCard(id)
  const updateCardMutation = useUpdateCard(id)
  const deleteCardMutation = useDeleteCard(id)

  const [isEditSetOpen, setEditSetOpen] = useState(false)
  const [cardDialog, setCardDialog] = useState<{ open: boolean; card: Card | null }>({ open: false, card: null })
  const [cardToDelete, setCardToDelete] = useState<Card | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  if (setQuery.isLoading || cardsQuery.isLoading) {
    return <CenteredSpinner />
  }

  if (setQuery.isError || !setQuery.data) {
    return <ErrorAlert message={getErrorMessage(setQuery.error, 'This card set could not be found.')} />
  }

  const cardSet = setQuery.data
  const cards = cardsQuery.data ?? []
  const collectUrl = `${window.location.origin}/collect/${cardSet.link_token}`

  async function handleUpdateSet(values: CardSetFormValues) {
    setActionError(null)
    try {
      await updateSetMutation.mutateAsync(values)
      setEditSetOpen(false)
    } catch (err) {
      setActionError(getErrorMessage(err, 'Could not update the card set.'))
    }
  }

  async function handleCardSubmit(values: CardFormValues) {
    setActionError(null)
    try {
      if (cardDialog.card) {
        await updateCardMutation.mutateAsync({ cardId: cardDialog.card.id, input: values })
      } else {
        await createCardMutation.mutateAsync(values)
      }
      setCardDialog({ open: false, card: null })
    } catch (err) {
      setActionError(getErrorMessage(err, 'Could not save the card.'))
    }
  }

  return (
    <Stack spacing={4}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Button size="small" onClick={() => navigate('/sets/mine')} sx={{ mb: 1 }}>
            ← Back to my sets
          </Button>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            {cardSet.name}
          </Typography>
          {cardSet.description && (
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              {cardSet.description}
            </Typography>
          )}
          <Chip
            size="small"
            sx={{ mt: 1 }}
            label={cardSet.is_public ? 'Public' : 'Unlisted'}
            color={cardSet.is_public ? 'success' : 'default'}
          />
        </Box>
        <Button variant="outlined" onClick={() => setEditSetOpen(true)}>
          Edit details
        </Button>
      </Stack>

      <ErrorAlert message={actionError} />

      {!cardSet.is_public && (
        <Stack spacing={1}>
          <Typography variant="subtitle2">Secret collection link</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', maxWidth: 560 }}>
            <TextField value={collectUrl} size="small" fullWidth slotProps={{ input: { readOnly: true } }} />
            <Tooltip title="Copy link">
              <IconButton onClick={() => navigator.clipboard.writeText(collectUrl)}>
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Button
              size="small"
              onClick={() => regenerateLinkMutation.mutate()}
              disabled={regenerateLinkMutation.isPending}
            >
              Regenerate
            </Button>
          </Stack>
        </Stack>
      )}

      <Stack spacing={2}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">Cards</Typography>
          <Button variant="contained" onClick={() => setCardDialog({ open: true, card: null })}>
            New card
          </Button>
        </Stack>
        {cards.length === 0 && <Typography color="text.secondary">No cards yet. Add the first one.</Typography>}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 2 }}>
          {cards.map((card) => (
            <CardTile
              key={card.id}
              card={card}
              actions={
                <Stack direction="row" spacing={1}>
                  <Button size="small" onClick={() => setCardDialog({ open: true, card })}>
                    Edit
                  </Button>
                  <Button size="small" color="error" onClick={() => setCardToDelete(card)}>
                    Delete
                  </Button>
                </Stack>
              }
            />
          ))}
        </Box>
      </Stack>

      <SetFormDialog
        open={isEditSetOpen}
        cardSet={cardSet}
        onClose={() => setEditSetOpen(false)}
        onSubmit={handleUpdateSet}
      />
      <CardFormDialog
        open={cardDialog.open}
        card={cardDialog.card}
        onClose={() => setCardDialog({ open: false, card: null })}
        onSubmit={handleCardSubmit}
      />
      <ConfirmDialog
        open={cardToDelete !== null}
        title="Delete card"
        description={`"${cardToDelete?.name}" will be permanently deleted from this set.`}
        loading={deleteCardMutation.isPending}
        onCancel={() => setCardToDelete(null)}
        onConfirm={() => {
          if (cardToDelete) {
            deleteCardMutation.mutate(cardToDelete.id, { onSuccess: () => setCardToDelete(null) })
          }
        }}
      />
    </Stack>
  )
}
