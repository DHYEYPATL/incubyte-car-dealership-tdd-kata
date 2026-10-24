import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Login from '../pages/Login'
import { api } from '../services/api'

vi.mock('../services/api', () => ({
  api: {
    login: vi.fn(),
    register: vi.fn(),
    setToken: vi.fn(),
    getToken: vi.fn(() => null),
    clearToken: vi.fn(),
  },
}))

function renderLogin() {
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('Login page', () => {
  it('renders sign in tab and register tab', () => {
    renderLogin()
    // The tabs are type="button", submit is type="submit"
    const tabButtons = screen.getAllByRole('button', { name: 'Sign in' })
    expect(tabButtons.length).toBeGreaterThanOrEqual(1)
    expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument()
  })

  it('shows username and password fields by default', () => {
    renderLogin()
    expect(screen.getByLabelText('Username')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
  })

  it('shows role field only in register mode', async () => {
    renderLogin()
    expect(screen.queryByLabelText('Role')).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Register' }))
    expect(screen.getByLabelText('Role')).toBeInTheDocument()
  })

  it('calls api.login with username and password on submit', async () => {
    api.login.mockResolvedValue({ ok: true, data: { access_token: 'tok' } })
    const { container } = renderLogin()

    await userEvent.type(screen.getByLabelText('Username'), 'alice')
    await userEvent.type(screen.getByLabelText('Password'), 'pass123')
    await userEvent.click(container.querySelector('[type="submit"]'))

    expect(api.login).toHaveBeenCalledWith('alice', 'pass123')
  })

  it('stores token after successful login', async () => {
    api.login.mockResolvedValue({ ok: true, data: { access_token: 'my-token' } })
    const { container } = renderLogin()

    await userEvent.type(screen.getByLabelText('Username'), 'alice')
    await userEvent.type(screen.getByLabelText('Password'), 'pass123')
    await userEvent.click(container.querySelector('[type="submit"]'))

    await waitFor(() => expect(api.setToken).toHaveBeenCalledWith('my-token'))
  })

  it('shows error message on failed login', async () => {
    api.login.mockResolvedValue({
      ok: false,
      data: { detail: 'Invalid credentials' },
    })
    const { container } = renderLogin()

    await userEvent.type(screen.getByLabelText('Username'), 'alice')
    await userEvent.type(screen.getByLabelText('Password'), 'wrong')
    await userEvent.click(container.querySelector('[type="submit"]'))

    await waitFor(() =>
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
    )
  })
})
