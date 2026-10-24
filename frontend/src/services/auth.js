import { api } from './api'

// Decode JWT payload to get username and role
export function decodeToken(token) {
  if (!token) return null
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload))
  } catch {
    return null
  }
}

export function getCurrentUser() {
  const token = api.getToken()
  if (!token) return null
  const payload = decodeToken(token)
  if (!payload) return null
  return {
    username: payload.sub,
    role: payload.role,
  }
}

export function isAdmin(user) {
  return user?.role === 'admin'
}

export function logout() {
  api.clearToken()
}
