import { Box, Button, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { getErrorMessage } from '../api/client'
import CardTile from '../components/cards/CardTile'
import CenteredSpinner from '../components/common/CenteredSpinner'
import ConfirmDialog from '../components/common/ConfirmDialog'
import ErrorAlert from '../components/common/ErrorAlert'
import { useLibrary, useRemoveFromLibrary } from '../hooks/useLibrary'

export default function LibraryPage() {
  const libraryQuery = useLibrary()
  const removeMutation = useRemoveFromLibrary()
  const [cardIdToRemove, setCardIdToRemove] = useState<number | null>(null)

  if (libraryQuery.isLoading) {
    return <CenteredSpinner />
  }

  if (libraryQuery.isError) {
    return <ErrorAlert message={getErrorMessage(libraryQuery.error, 'Could not load your library.')} />
  }

  const entries = libraryQuery.data ?? []

  return (
    <Stack spacing={3}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
        My library
      </Typography>
      <ErrorAlert message={removeMutation.isError ? getErrorMessage(removeMutation.error, 'Could not remove that card.') : null} />
      {entries.length === 0 && (
        <Typography color="text.secondary">
          You haven't collected any cards yet. Browse public sets or use a set's link to get started.
        </Typography>
      )}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 2 }}>
        {entries.map((entry) => (
          <CardTile
            key={entry.card.id}
            card={entry.card}
            actions={
              <Button size="small" color="error" onClick={() => setCardIdToRemove(entry.card.id)}>
                Remove
              </Button>
            }
          />
        ))}
      </Box>
      <ConfirmDialog
        open={cardIdToRemove !== null}
        title="Remove card"
        description="This card will be removed from your library. You can add it again later if it's still available."
        onCancel={() => setCardIdToRemove(null)}
        loading={removeMutation.isPending}
        onConfirm={() => {
          if (cardIdToRemove !== null) {
            removeMutation.mutate(cardIdToRemove, { onSuccess: () => setCardIdToRemove(null) })
          }
        }}
      />
    </Stack>
  )
}
