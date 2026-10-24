import { describe, it, expect } from 'vitest'
import { decodeToken } from '../services/auth'

describe('auth helpers', () => {
  it('decodeToken extracts username and role from a valid JWT', () => {
    // Create a minimal JWT: header.payload.signature
    const payload = btoa(JSON.stringify({ sub: 'admin', role: 'admin' }))
    const token = `header.${payload}.signature`

    const result = decodeToken(token)

    expect(result.sub).toBe('admin')
    expect(result.role).toBe('admin')
  })

  it('decodeToken returns null for invalid token', () => {
    expect(decodeToken('not-a-jwt')).toBeNull()
    expect(decodeToken(null)).toBeNull()
    expect(decodeToken('')).toBeNull()
  })
})
