import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Inventory from './pages/Inventory'
import { getCurrentUser } from './services/auth'

function ProtectedRoute({ children }) {
  const user = getCurrentUser()
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Inventory />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
