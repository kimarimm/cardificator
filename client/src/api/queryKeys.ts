export const queryKeys = {
  me: ['me'] as const,
  users: ['users'] as const,
  mySets: ['sets', 'mine'] as const,
  publicSets: ['sets', 'public'] as const,
  setByLink: (token: string) => ['sets', 'by-link', token] as const,
  set: (setId: number) => ['sets', setId] as const,
  cards: (setId: number) => ['sets', setId, 'cards'] as const,
  library: ['library'] as const,
}
