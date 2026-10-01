import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { Box, Button, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getErrorMessage } from '../api/client'
import type { CardSetDetail } from '../api/types'
import ConfirmDialog from '../components/common/ConfirmDialog'
import CenteredSpinner from '../components/common/CenteredSpinner'
import ErrorAlert from '../components/common/ErrorAlert'
import SetFormDialog from '../components/sets/SetFormDialog'
import SetSummaryCard from '../components/sets/SetSummaryCard'
import { useCreateSet, useDeleteSet, useMySets } from '../hooks/useSets'
import type { CardSetFormValues } from '../validation/schemas'

export default function MySetsPage() {
  const setsQuery = useMySets()
  const createMutation = useCreateSet()
  const deleteMutation = useDeleteSet()
  const navigate = useNavigate()

  const [isCreateOpen, setCreateOpen] = useState(false)
  const [setToDelete, setSetToDelete] = useState<CardSetDetail | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  if (setsQuery.isLoading) {
    return <CenteredSpinner />
  }

  if (setsQuery.isError) {
    return <ErrorAlert message={getErrorMessage(setsQuery.error, 'Could not load your card sets.')} />
  }

  const sets = setsQuery.data ?? []

  async function handleCreate(values: CardSetFormValues) {
    setFormError(null)
    try {
      const created = await createMutation.mutateAsync(values)
      setCreateOpen(false)
      navigate(`/sets/mine/${created.id}`)
    } catch (err) {
      setFormError(getErrorMessage(err, 'Could not create the card set.'))
    }
  }

  async function copyLink(cardSet: CardSetDetail) {
    const url = `${window.location.origin}/collect/${cardSet.link_token}`
    await navigator.clipboard.writeText(url)
  }

  return (
    <Stack spacing={3}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          My card sets
        </Typography>
        <Button variant="contained" onClick={() => setCreateOpen(true)}>
          New set
        </Button>
      </Stack>
      {sets.length === 0 && <Typography color="text.secondary">You haven't created any card sets yet.</Typography>}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 2 }}>
        {sets.map((set) => (
          <SetSummaryCard
            key={set.id}
            cardSet={set}
            actions={
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center', width: '100%' }}>
                <Button size="small" onClick={() => navigate(`/sets/mine/${set.id}`)}>
                  Manage
                </Button>
                {!set.is_public && (
                  <Tooltip title="Copy collection link">
                    <IconButton size="small" onClick={() => copyLink(set)}>
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
                <Box sx={{ flexGrow: 1 }} />
                <Button size="small" color="error" onClick={() => setSetToDelete(set)}>
                  Delete
                </Button>
              </Stack>
            }
          />
        ))}
      </Box>
      <SetFormDialog
        open={isCreateOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
      />
      <ErrorAlert message={formError} />
      <ConfirmDialog
        open={setToDelete !== null}
        title="Delete card set"
        description={`"${setToDelete?.name}" and all of its cards will be permanently deleted.`}
        loading={deleteMutation.isPending}
        onCancel={() => setSetToDelete(null)}
        onConfirm={() => {
          if (setToDelete) {
            deleteMutation.mutate(setToDelete.id, { onSuccess: () => setSetToDelete(null) })
          }
        }}
      />
    </Stack>
  )
}
