import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import { decodeToken } from '../services/auth'

export default function Login() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('user')
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (mode === 'register') {
      const res = await api.register(username, password, role)
      if (!res.ok) {
        setError(res.data?.detail || 'Registration failed')
        return
      }
    }

    const res = await api.login(username, password)
    if (!res.ok) {
      setError(res.data?.detail || 'Login failed')
      return
    }

    api.setToken(res.data.access_token)
    navigate('/')
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Dealership Inventory</h1>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => setMode('login')}
            type="button"
          >
            Sign in
          </button>
          <button
            className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => setMode('register')}
            type="button"
          >
            Register
          </button>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {mode === 'register' && (
            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="user">User — browse and purchase</option>
                <option value="admin">Admin — manage inventory</option>
              </select>
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-block">
            {mode === 'login' ? 'Sign in' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  )
}
