import { Box, Button, Stack, Typography } from '@mui/material'
import { useParams } from 'react-router-dom'
import { getErrorMessage } from '../api/client'
import CardTile from '../components/cards/CardTile'
import CenteredSpinner from '../components/common/CenteredSpinner'
import ErrorAlert from '../components/common/ErrorAlert'
import { useAddToLibrary, useLibrary } from '../hooks/useLibrary'
import { useSetByLink } from '../hooks/useSets'

export default function CollectPage() {
  const { token = '' } = useParams<{ token: string }>()
  const setQuery = useSetByLink(token)
  const libraryQuery = useLibrary()
  const addMutation = useAddToLibrary()

  const libraryCardIds = new Set(libraryQuery.data?.map((entry) => entry.card.id))

  if (setQuery.isLoading) {
    return <CenteredSpinner />
  }

  if (setQuery.isError) {
    return <ErrorAlert message={getErrorMessage(setQuery.error, 'This link is invalid or has expired.')} />
  }

  const cardSet = setQuery.data
  if (!cardSet) {
    return null
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          {cardSet.name}
        </Typography>
        {cardSet.description && (
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            {cardSet.description}
          </Typography>
        )}
      </Box>
      <ErrorAlert message={addMutation.isError ? getErrorMessage(addMutation.error, 'Could not add card to your library.') : null} />
      {cardSet.cards.length === 0 && <Typography color="text.secondary">This set has no cards yet.</Typography>}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 2 }}>
        {cardSet.cards.map((card) => {
          const inLibrary = libraryCardIds.has(card.id)
          const isAdding = addMutation.isPending && addMutation.variables?.cardId === card.id
          return (
            <CardTile
              key={card.id}
              card={card}
              actions={
                <Button
                  size="small"
                  disabled={inLibrary || isAdding}
                  onClick={() => addMutation.mutate({ cardId: card.id, linkToken: token })}
                >
                  {inLibrary ? 'In your library' : 'Add to library'}
                </Button>
              }
            />
          )
        })}
      </Box>
    </Stack>
  )
}
