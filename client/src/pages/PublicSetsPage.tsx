import { Box, Button, Divider, Stack, Typography } from '@mui/material'
import { getErrorMessage } from '../api/client'
import CardTile from '../components/cards/CardTile'
import CenteredSpinner from '../components/common/CenteredSpinner'
import ErrorAlert from '../components/common/ErrorAlert'
import { useAddToLibrary, useLibrary } from '../hooks/useLibrary'
import { usePublicSets } from '../hooks/useSets'

const cardGridSx = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
  gap: 2,
}

export default function PublicSetsPage() {
  const setsQuery = usePublicSets()
  const libraryQuery = useLibrary()
  const addMutation = useAddToLibrary()

  const libraryCardIds = new Set(libraryQuery.data?.map((entry) => entry.card.id))

  if (setsQuery.isLoading) {
    return <CenteredSpinner />
  }

  if (setsQuery.isError) {
    return <ErrorAlert message={getErrorMessage(setsQuery.error, 'Could not load public sets.')} />
  }

  const sets = setsQuery.data ?? []

  return (
    <Stack spacing={5}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
        Browse public sets
      </Typography>
      <ErrorAlert message={addMutation.isError ? getErrorMessage(addMutation.error, 'Could not add card to your library.') : null} />
      {sets.length === 0 && <Typography color="text.secondary">No public sets yet.</Typography>}
      {sets.map((set) => (
        <Stack key={set.id} spacing={2}>
          <Box>
            <Typography variant="h6">{set.name}</Typography>
            {set.description && (
              <Typography variant="body2" color="text.secondary">
                {set.description}
              </Typography>
            )}
          </Box>
          <Box sx={cardGridSx}>
            {set.cards.map((card) => {
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
                      onClick={() => addMutation.mutate({ cardId: card.id })}
                    >
                      {inLibrary ? 'In your library' : 'Add to library'}
                    </Button>
                  }
                />
              )
            })}
          </Box>
          <Divider />
        </Stack>
      ))}
    </Stack>
  )
}
