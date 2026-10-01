import { Card, CardActions, CardContent, Chip, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import type { CardSetSummary } from '../../api/types'

interface SetSummaryCardProps {
  cardSet: CardSetSummary
  cardCount?: number
  actions?: ReactNode
}

export default function SetSummaryCard({ cardSet, cardCount, actions }: SetSummaryCardProps) {
  return (
    <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack direction="row" spacing={1} sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography variant="h6" component="h3">
            {cardSet.name}
          </Typography>
          <Chip
            size="small"
            label={cardSet.is_public ? 'Public' : 'Unlisted'}
            color={cardSet.is_public ? 'success' : 'default'}
          />
        </Stack>
        {cardSet.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {cardSet.description}
          </Typography>
        )}
        {cardCount !== undefined && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            {cardCount} card{cardCount === 1 ? '' : 's'}
          </Typography>
        )}
      </CardContent>
      {actions && <CardActions>{actions}</CardActions>}
    </Card>
  )
}
