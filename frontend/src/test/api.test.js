import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock global fetch
const mockFetch = vi.fn()
global.fetch = mockFetch
global.localStorage = {
  store: {},
  getItem(key) { return this.store[key] || null },
  setItem(key, value) { this.store[key] = value },
  removeItem(key) { delete this.store[key] },
  clear() { this.store = {} },
}

// Import after mocks are set up
const { api } = await import('../services/api')

beforeEach(() => {
  mockFetch.mockReset()
  global.localStorage.clear()
})

describe('api service', () => {
  it('login sends POST to /api/auth/login with credentials', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ access_token: 'fake-token', token_type: 'bearer' }),
    })

    const res = await api.login('admin', 'secret123')

    expect(mockFetch).toHaveBeenCalledWith('/api/auth/login', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ username: 'admin', password: 'secret123' }),
    }))
    expect(res.ok).toBe(true)
    expect(res.data.access_token).toBe('fake-token')
  })

  it('register sends POST to /api/auth/register with role', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({ id: 1, username: 'admin', role: 'admin' }),
    })

    const res = await api.register('admin', 'secret123', 'admin')

    expect(mockFetch).toHaveBeenCalledWith('/api/auth/register', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ username: 'admin', password: 'secret123', role: 'admin' }),
    }))
    expect(res.ok).toBe(true)
  })

  it('getVehicles sends GET with auth header', async () => {
    api.setToken('my-token')
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => [],
    })

    await api.getVehicles()

    expect(mockFetch).toHaveBeenCalledWith('/api/vehicles', expect.objectContaining({
      headers: expect.objectContaining({
        Authorization: 'Bearer my-token',
      }),
    }))
  })

  it('getVehicles appends search param when provided', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => [],
    })

    await api.getVehicles('toyota')

    expect(mockFetch).toHaveBeenCalledWith('/api/vehicles?search=toyota', expect.any(Object))
  })

  it('purchaseVehicle sends POST to purchase endpoint', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ id: 1, quantity: 4 }),
    })

    await api.purchaseVehicle(1)

    expect(mockFetch).toHaveBeenCalledWith('/api/vehicles/1/purchase', expect.objectContaining({
      method: 'POST',
    }))
  })

  it('createVehicle sends POST with vehicle data', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({ id: 1, make: 'Toyota' }),
    })

    await api.createVehicle({ make: 'Toyota', model: 'Camry', category: 'Sedan', price: 25000, quantity: 5 })

    expect(mockFetch).toHaveBeenCalledWith('/api/vehicles', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ make: 'Toyota', model: 'Camry', category: 'Sedan', price: 25000, quantity: 5 }),
    }))
  })

  it('clears token on 401 response', async () => {
    api.setToken('expired')
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ detail: 'Could not validate credentials' }),
    })

    await api.getVehicles()

    expect(api.getToken()).toBeNull()
  })
})
