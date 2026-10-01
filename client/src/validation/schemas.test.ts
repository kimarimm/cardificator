import { describe, expect, it } from 'vitest'
import { cardSchema, cardSetSchema, registerSchema } from './schemas'

describe('cardSchema', () => {
  it('accepts a valid card', () => {
    const result = cardSchema.safeParse({
      name: 'Dragon',
      symbol: '🐉',
      color: '#A1B2C3',
      description: 'Fierce and fiery.',
    })
    expect(result.success).toBe(true)
  })

  it.each(['A1B2C3', '#A1B2C', '#GGGGGG', ''])('rejects invalid color %s', (color) => {
    const result = cardSchema.safeParse({ name: 'Dragon', symbol: '🐉', color, description: '' })
    expect(result.success).toBe(false)
  })

  it('rejects an empty name', () => {
    const result = cardSchema.safeParse({ name: '', symbol: '🐉', color: '#A1B2C3', description: '' })
    expect(result.success).toBe(false)
  })
})

describe('cardSetSchema', () => {
  it('requires a name but allows an empty description', () => {
    expect(cardSetSchema.safeParse({ name: '', description: '', is_public: false }).success).toBe(false)
    expect(cardSetSchema.safeParse({ name: 'My Set', description: '', is_public: false }).success).toBe(true)
  })
})

describe('registerSchema', () => {
  it('rejects a short password', () => {
    const result = registerSchema.safeParse({
      username: 'alice',
      email: 'alice@example.com',
      password: 'short',
    })
    expect(result.success).toBe(false)
  })

  it('rejects an invalid email', () => {
    const result = registerSchema.safeParse({
      username: 'alice',
      email: 'not-an-email',
      password: 'longenoughpassword',
    })
    expect(result.success).toBe(false)
  })

  it('accepts valid registration details', () => {
    const result = registerSchema.safeParse({
      username: 'alice',
      email: 'alice@example.com',
      password: 'longenoughpassword',
    })
    expect(result.success).toBe(true)
  })
})
