import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import { getCurrentUser, isAdmin, logout } from '../services/auth'
import VehicleRow from '../components/VehicleRow'
import VehicleModal from '../components/VehicleModal'

export default function Inventory() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [vehicles, setVehicles] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modal, setModal] = useState(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      navigate('/login')
      return
    }
    setUser(currentUser)
  }, [navigate])

  const fetchVehicles = useCallback(async () => {
    setLoading(true)
    const params = { search, category, minPrice, maxPrice }
    const hasFilters = search || category || minPrice || maxPrice
    const res = hasFilters
      ? await api.searchVehicles(params)
      : await api.getVehicles()
    if (res.ok) {
      setVehicles(res.data)
      setError('')
    } else if (res.status === 401) {
      navigate('/login')
    } else {
      setError('Could not load vehicles')
    }
    setLoading(false)
  }, [search, category, minPrice, maxPrice, navigate])

  useEffect(() => {
    if (user) fetchVehicles()
  }, [user, fetchVehicles])

  function handleLogout() {
    logout()
    navigate('/login')
  }

  async function handlePurchase(id) {
    const res = await api.purchaseVehicle(id)
    if (res.ok) {
      setVehicles((prev) => prev.map((v) => (v.id === id ? res.data : v)))
      setError('')
    } else if (res.status === 400) {
      setError('Vehicle out of stock')
    } else if (res.status === 401) {
      navigate('/login')
    } else {
      setError(res.data?.detail || 'Purchase failed')
    }
  }

  async function handleDelete(id) {
    const res = await api.deleteVehicle(id)
    if (res.ok) {
      setVehicles((prev) => prev.filter((v) => v.id !== id))
      setModal(null)
      setError('')
    } else {
      setError(res.data?.detail || 'Delete failed')
    }
  }

  async function handleSaveVehicle(vehicleData) {
    if (modal.mode === 'add') {
      const res = await api.createVehicle(vehicleData)
      if (res.ok) {
        setVehicles((prev) => [...prev, res.data])
        setModal(null)
        setError('')
      } else {
        setError(res.data?.detail || 'Could not add vehicle')
      }
    } else {
      const res = await api.updateVehicle(modal.vehicle.id, vehicleData)
      if (res.ok) {
        setVehicles((prev) => prev.map((v) => (v.id === modal.vehicle.id ? res.data : v)))
        setModal(null)
        setError('')
      } else {
        setError(res.data?.detail || 'Could not update vehicle')
      }
    }
  }

  async function handleRestock(id, quantity) {
    const res = await api.restockVehicle(id, quantity)
    if (res.ok) {
      setVehicles((prev) => prev.map((v) => (v.id === id ? res.data : v)))
      setModal(null)
      setError('')
    } else {
      setError(res.data?.detail || 'Restock failed')
    }
  }

  const admin = isAdmin(user)
  const handleEnter = (e) => { if (e.key === 'Enter') fetchVehicles() }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Inventory</h1>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {user && (
            <span className="user-badge">
              {user.username}
              <span className={`role-tag ${admin ? 'admin' : ''}`}>
                {admin ? 'admin' : 'user'}
              </span>
            </span>
          )}
          <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </header>

      {error && <div className="error-msg">{error}</div>}

      <div className="inventory-toolbar">
        <input
          className="search-input"
          type="text"
          placeholder="Search by make or model…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleEnter}
        />
        <input
          className="search-input search-narrow"
          type="text"
          placeholder="Category…"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          onKeyDown={handleEnter}
        />
        <input
          className="search-input search-price"
          type="number"
          placeholder="Min price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          onKeyDown={handleEnter}
        />
        <input
          className="search-input search-price"
          type="number"
          placeholder="Max price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          onKeyDown={handleEnter}
        />
        <button className="btn btn-ghost" onClick={fetchVehicles}>
          Search
        </button>
        {admin && (
          <button className="btn btn-primary" onClick={() => setModal({ mode: 'add' })}>
            Add vehicle
          </button>
        )}
      </div>

      {loading ? (
        <div className="empty-state"><p>Loading vehicles…</p></div>
      ) : vehicles.length === 0 ? (
        <div className="empty-state">
          <p>No vehicles found.</p>
          {admin && (
            <button className="btn btn-primary" onClick={() => setModal({ mode: 'add' })}>
              Add your first vehicle
            </button>
          )}
        </div>
      ) : (
        <table className="vehicle-table">
          <thead>
            <tr>
              <th>Make</th>
              <th>Model</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v) => (
              <VehicleRow
                key={v.id}
                vehicle={v}
                isAdmin={admin}
                onPurchase={handlePurchase}
                onEdit={(vehicle) => setModal({ mode: 'edit', vehicle })}
                onRestock={(vehicle) => setModal({ mode: 'restock', vehicle })}
                onDelete={(vehicle) => setModal({ mode: 'delete', vehicle })}
              />
            ))}
          </tbody>
        </table>
      )}

      {modal && (
        <VehicleModal
          modal={modal}
          onClose={() => setModal(null)}
          onSave={handleSaveVehicle}
          onDelete={handleDelete}
          onRestock={handleRestock}
        />
      )}
    </div>
  )
}
