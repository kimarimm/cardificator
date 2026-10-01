export type Role = 'user' | 'creator' | 'administrator'

export interface User {
  id: number
  username: string
  email: string
  role: Role
}

export interface TokenResponse {
  access_token: string
  token_type: string
}

export interface Card {
  id: number
  set_id: number
  name: string
  symbol: string
  color: string
  description: string
}

export type CardInput = {
  name: string
  symbol: string
  color: string
  description: string
}

export interface CardSetSummary {
  id: number
  name: string
  description: string
  is_public: boolean
}

export interface CardSetDetail extends CardSetSummary {
  owner_id: number
  link_token: string
  created_at: string
}

export interface CardSetWithCards extends CardSetSummary {
  cards: Card[]
}

export type CardSetInput = {
  name: string
  description: string
  is_public: boolean
}

export interface LibraryEntry {
  card: Card
  added_at: string
}

export interface ApiError {
  detail: string
}
