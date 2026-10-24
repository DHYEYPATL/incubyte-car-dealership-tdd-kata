import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Inventory from '../pages/Inventory'
import { api } from '../services/api'
import * as authService from '../services/auth'

vi.mock('../services/api', () => ({
  api: {
    getVehicles: vi.fn(),
    purchaseVehicle: vi.fn(),
    deleteVehicle: vi.fn(),
    createVehicle: vi.fn(),
    updateVehicle: vi.fn(),
    restockVehicle: vi.fn(),
    getToken: vi.fn(() => 'fake-token'),
    clearToken: vi.fn(),
  },
}))

vi.mock('../services/auth', () => ({
  getCurrentUser: vi.fn(),
  isAdmin: vi.fn(),
  logout: vi.fn(),
}))

const vehicles = [
  { id: 1, make: 'Toyota', model: 'Camry', category: 'Sedan', price: 25000, quantity: 5 },
  { id: 2, make: 'Honda', model: 'Civic', category: 'Sedan', price: 22000, quantity: 0 },
]

function renderInventory() {
  return render(
    <MemoryRouter>
      <Inventory />
    </MemoryRouter>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  authService.getCurrentUser.mockReturnValue({ username: 'alice', role: 'user' })
  authService.isAdmin.mockReturnValue(false)
  api.getVehicles.mockResolvedValue({ ok: true, data: vehicles })
})

describe('Inventory page', () => {
  it('renders vehicle make and model from API', async () => {
    renderInventory()
    await waitFor(() => expect(screen.getByText('Toyota')).toBeInTheDocument())
    expect(screen.getByText('Camry')).toBeInTheDocument()
    expect(screen.getByText('Honda')).toBeInTheDocument()
    expect(screen.getByText('Civic')).toBeInTheDocument()
  })

  it('shows Buy button enabled for in-stock vehicle', async () => {
    renderInventory()
    await waitFor(() => screen.getByText('Toyota'))
    const buyButtons = screen.getAllByRole('button', { name: 'Buy' })
    expect(buyButtons[0]).not.toBeDisabled()
  })

  it('shows Sold out button disabled for out-of-stock vehicle', async () => {
    renderInventory()
    await waitFor(() => screen.getByText('Honda'))
    expect(screen.getByRole('button', { name: /sold out/i })).toBeDisabled()
  })

  it('shows empty state when no vehicles exist', async () => {
    api.getVehicles.mockResolvedValue({ ok: true, data: [] })
    renderInventory()
    await waitFor(() =>
      expect(screen.getByText(/no vehicles found/i)).toBeInTheDocument()
    )
  })

  it('hides admin buttons for non-admin user', async () => {
    renderInventory()
    await waitFor(() => screen.getByText('Toyota'))
    expect(screen.queryByRole('button', { name: 'Add vehicle' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Edit' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument()
  })

  it('shows Add vehicle button for admin user', async () => {
    authService.getCurrentUser.mockReturnValue({ username: 'admin', role: 'admin' })
    authService.isAdmin.mockReturnValue(true)
    renderInventory()
    await waitFor(() => screen.getByText('Toyota'))
    expect(screen.getByRole('button', { name: 'Add vehicle' })).toBeInTheDocument()
  })
})
