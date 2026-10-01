const STORAGE_KEY = 'cardificator.token'

export const tokenStorage = {
  get(): string | null {
    return localStorage.getItem(STORAGE_KEY)
  },
  set(token: string): void {
    localStorage.setItem(STORAGE_KEY, token)
  },
  clear(): void {
    localStorage.removeItem(STORAGE_KEY)
  },
}

export const authEvents = new EventTarget()
export const UNAUTHORIZED_EVENT = 'cardificator:unauthorized'

export function emitUnauthorized(): void {
  authEvents.dispatchEvent(new Event(UNAUTHORIZED_EVENT))
}
