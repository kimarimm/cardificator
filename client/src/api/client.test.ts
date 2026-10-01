import { AxiosError, AxiosHeaders } from 'axios'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { getErrorMessage, handleResponseError } from './client'
import { tokenStorage, UNAUTHORIZED_EVENT, authEvents } from './tokenStorage'

function makeError(status: number, hadAuthHeader: boolean): AxiosError {
  const headers = new AxiosHeaders()
  if (hadAuthHeader) {
    headers.set('Authorization', 'Bearer sometoken')
  }
  return new AxiosError('Request failed', undefined, { headers } as never, undefined, {
    status,
    data: { detail: 'bad request' },
    statusText: 'error',
    headers: {},
    config: { headers } as never,
  })
}

describe('getErrorMessage', () => {
  it('extracts the detail field from an API error response', () => {
    const error = makeError(400, false)
    expect(getErrorMessage(error)).toBe('bad request')
  })

  it('falls back when the error is not an axios error', () => {
    expect(getErrorMessage(new Error('boom'), 'fallback message')).toBe('fallback message')
  })
})

describe('handleResponseError', () => {
  afterEach(() => {
    tokenStorage.clear()
  })

  it('clears the token and emits unauthorized when a request with a token gets a 401', async () => {
    tokenStorage.set('sometoken')
    const listener = vi.fn()
    authEvents.addEventListener(UNAUTHORIZED_EVENT, listener)

    await expect(handleResponseError(makeError(401, true))).rejects.toBeInstanceOf(AxiosError)

    expect(tokenStorage.get()).toBeNull()
    expect(listener).toHaveBeenCalledOnce()
    authEvents.removeEventListener(UNAUTHORIZED_EVENT, listener)
  })

  it('does not emit unauthorized for a 401 on an unauthenticated request (e.g. bad login)', async () => {
    const listener = vi.fn()
    authEvents.addEventListener(UNAUTHORIZED_EVENT, listener)

    await expect(handleResponseError(makeError(401, false))).rejects.toBeInstanceOf(AxiosError)

    expect(listener).not.toHaveBeenCalled()
    authEvents.removeEventListener(UNAUTHORIZED_EVENT, listener)
  })

  it('leaves the token alone for non-401 errors', async () => {
    tokenStorage.set('sometoken')
    await expect(handleResponseError(makeError(500, true))).rejects.toBeInstanceOf(AxiosError)
    expect(tokenStorage.get()).toBe('sometoken')
  })
})
