const API_URL = '/api'

function getToken() {
  return localStorage.getItem('token')
}

function setToken(token) {
  localStorage.setItem('token', token)
}

function clearToken() {
  localStorage.removeItem('token')
}

function authHeaders() {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...authHeaders(),
    ...options.headers,
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  })

  if (response.status === 401) {
    clearToken()
  }

  const data = await response.json().catch(() => null)
  return { ok: response.ok, status: response.status, data }
}

export const api = {
  register: (username, password, role) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password, role }),
    }),

  login: (username, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  getVehicles: (search = '') =>
    request(`/vehicles${search ? `?search=${encodeURIComponent(search)}` : ''}`),

  createVehicle: (vehicle) =>
    request('/vehicles', {
      method: 'POST',
      body: JSON.stringify(vehicle),
    }),

  updateVehicle: (id, vehicle) =>
    request(`/vehicles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(vehicle),
    }),

  deleteVehicle: (id) =>
    request(`/vehicles/${id}`, { method: 'DELETE' }),

  purchaseVehicle: (id) =>
    request(`/vehicles/${id}/purchase`, { method: 'POST' }),

  restockVehicle: (id, quantity) =>
    request(`/vehicles/${id}/restock`, {
      method: 'POST',
      body: JSON.stringify({ quantity }),
    }),

  setToken,
  getToken,
  clearToken,
}
