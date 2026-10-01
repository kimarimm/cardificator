import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { Card } from '../../api/types'
import CardTile from './CardTile'

const card: Card = {
  id: 1,
  set_id: 1,
  name: 'Dragon',
  symbol: '🐉',
  color: '#FF0000',
  description: 'Fierce and fiery.',
}

describe('CardTile', () => {
  it('renders the card name, symbol and description', () => {
    render(<CardTile card={card} />)
    expect(screen.getByText('Dragon')).toBeInTheDocument()
    expect(screen.getByText('🐉')).toBeInTheDocument()
    expect(screen.getByText('Fierce and fiery.')).toBeInTheDocument()
  })

  it('omits the description paragraph when there is none', () => {
    render(<CardTile card={{ ...card, description: '' }} />)
    expect(screen.queryByText('Fierce and fiery.')).not.toBeInTheDocument()
  })

  it('renders the provided actions', () => {
    render(<CardTile card={card} actions={<button>Add to library</button>} />)
    expect(screen.getByRole('button', { name: 'Add to library' })).toBeInTheDocument()
  })
})
