import { z } from 'zod'

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
})
export type LoginFormValues = z.infer<typeof loginSchema>

export const registerSchema = z.object({
  username: z.string().min(3, 'At least 3 characters').max(64),
  email: z.email('Enter a valid email address'),
  password: z.string().min(8, 'At least 8 characters').max(128),
})
export type RegisterFormValues = z.infer<typeof registerSchema>

export const cardSetSchema = z.object({
  name: z.string().min(1, 'Name is required').max(128),
  description: z.string().max(1024),
  is_public: z.boolean(),
})
export type CardSetFormValues = z.infer<typeof cardSetSchema>

const hexColorRegex = /^#[0-9A-Fa-f]{6}$/

export const cardSchema = z.object({
  name: z.string().min(1, 'Name is required').max(128),
  symbol: z.string().min(1, 'Symbol is required').max(16),
  color: z.string().regex(hexColorRegex, 'Must be a hex code like #A1B2C3'),
  description: z.string().max(1024),
})
export type CardFormValues = z.infer<typeof cardSchema>
