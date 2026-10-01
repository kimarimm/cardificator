import { Card as MuiCard, CardActions, CardContent, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import type { Card } from '../../api/types'

interface CardTileProps {
  card: Card
  actions?: ReactNode
}

export default function CardTile({ card, actions }: CardTileProps) {
  return (
    <MuiCard variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 1 }}>
          <Stack
            sx={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 44,
              height: 44,
              borderRadius: '50%',
              backgroundColor: card.color,
              fontSize: 22,
              flexShrink: 0,
            }}
          >
            {card.symbol}
          </Stack>
          <Typography variant="h6" component="h3" noWrap title={card.name}>
            {card.name}
          </Typography>
        </Stack>
        {card.description && (
          <Typography variant="body2" color="text.secondary">
            {card.description}
          </Typography>
        )}
      </CardContent>
      {actions && <CardActions>{actions}</CardActions>}
    </MuiCard>
  )
}
