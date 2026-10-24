import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import { getCurrentUser, isAdmin, logout } from '../services/auth'

export default function Inventory() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [vehicles, setVehicles] = useState([])
  const [search, setSearch] = useState('')
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
    const res = await api.getVehicles(search)
    if (res.ok) {
      setVehicles(res.data)
      setError('')
    } else if (res.status === 401) {
      navigate('/login')
    } else {
      setError('Could not load vehicles')
    }
    setLoading(false)
  }, [search, navigate])

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
      setVehicles((prev) =>
        prev.map((v) => (v.id === id ? res.data : v)),
      )
    } else if (res.status === 400) {
      setError('Vehicle out of stock')
    } else if (res.status === 401) {
      navigate('/login')
    }
  }

  async function handleDelete(id) {
    const res = await api.deleteVehicle(id)
    if (res.ok) {
      setVehicles((prev) => prev.filter((v) => v.id !== id))
      setModal(null)
    }
  }

  async function handleSaveVehicle(vehicleData) {
    if (modal.mode === 'add') {
      const res = await api.createVehicle(vehicleData)
      if (res.ok) {
        setVehicles((prev) => [...prev, res.data])
        setModal(null)
      } else {
        setError(res.data?.detail || 'Could not add vehicle')
      }
    } else if (modal.mode === 'edit') {
      const res = await api.updateVehicle(modal.vehicle.id, vehicleData)
      if (res.ok) {
        setVehicles((prev) =>
          prev.map((v) => (v.id === modal.vehicle.id ? res.data : v)),
        )
        setModal(null)
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
    }
  }

  function getStockClass(quantity) {
    if (quantity <= 0) return 'out'
    if (quantity <= 2) return 'low'
    return 'in-stock'
  }

  function getStockPct(quantity, max = 10) {
    if (quantity <= 0) return 0
    return Math.min((quantity / max) * 100, 100)
  }

  const admin = isAdmin(user)

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
          onKeyDown={(e) => e.key === 'Enter' && fetchVehicles()}
        />
        <button className="btn btn-ghost" onClick={fetchVehicles}>
          Search
        </button>
        {admin && (
          <button
            className="btn btn-primary"
            onClick={() => setModal({ mode: 'add' })}
          >
            Add vehicle
          </button>
        )}
      </div>

      {loading ? (
        <div className="empty-state">
          <p>Loading vehicles…</p>
        </div>
      ) : vehicles.length === 0 ? (
        <div className="empty-state">
          <p>No vehicles found.</p>
          {admin && (
            <button
              className="btn btn-primary"
              onClick={() => setModal({ mode: 'add' })}
            >
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
            {vehicles.map((v) => {
              const stockClass = getStockClass(v.quantity)
              const outOfStock = v.quantity <= 0
              return (
                <tr key={v.id}>
                  <td data-label="Make">{v.make}</td>
                  <td data-label="Model">{v.model}</td>
                  <td data-label="Category">{v.category}</td>
                  <td data-label="Price" className="mono">
                    ${v.price.toLocaleString()}
                  </td>
                  <td data-label="Stock">
                    <div className="stock-gauge">
                      <div className="stock-bar">
                        <div
                          className={`stock-bar-fill ${stockClass}`}
                          style={{ width: `${getStockPct(v.quantity)}%` }}
                        />
                      </div>
                      <span className={`stock-number ${outOfStock ? 'out' : ''}`}>
                        {v.quantity}
                      </span>
                    </div>
                  </td>
                  <td data-label="Actions">
                    <div className="actions">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handlePurchase(v.id)}
                        disabled={outOfStock}
                      >
                        {outOfStock ? 'Sold out' : 'Buy'}
                      </button>
                      {admin && (
                        <>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => setModal({ mode: 'edit', vehicle: v })}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => setModal({ mode: 'restock', vehicle: v })}
                          >
                            Restock
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => setModal({ mode: 'delete', vehicle: v })}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
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

function VehicleModal({ modal, onClose, onSave, onDelete, onRestock }) {
  const [make, setMake] = useState(modal.vehicle?.make || '')
  const [model, setModel] = useState(modal.vehicle?.model || '')
  const [category, setCategory] = useState(modal.vehicle?.category || '')
  const [price, setPrice] = useState(modal.vehicle?.price || '')
  const [quantity, setQuantity] = useState(modal.vehicle?.quantity ?? 0)
  const [restockQty, setRestockQty] = useState(1)

  const isAdd = modal.mode === 'add'
  const isEdit = modal.mode === 'edit'
  const isDelete = modal.mode === 'delete'
  const isRestock = modal.mode === 'restock'

  function handleSave(e) {
    e.preventDefault()
    onSave({
      make,
      model,
      category,
      price: parseFloat(price),
      quantity: parseInt(quantity, 10),
    })
  }

  function handleRestockSubmit(e) {
    e.preventDefault()
    onRestock(modal.vehicle.id, parseInt(restockQty, 10))
  }

  if (isDelete) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <h2>Delete vehicle</h2>
          <p className="muted">
            Delete {modal.vehicle.make} {modal.vehicle.model}? This cannot be undone.
          </p>
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn btn-danger"
              onClick={() => onDelete(modal.vehicle.id)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (isRestock) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <h2>Restock {modal.vehicle.make} {modal.vehicle.model}</h2>
          <p className="muted">
            Current stock: <span className="mono">{modal.vehicle.quantity}</span>
          </p>
          <form onSubmit={handleRestockSubmit} style={{ marginTop: '16px' }}>
            <div className="form-group">
              <label htmlFor="restock-qty">Units to add</label>
              <input
                id="restock-qty"
                type="number"
                min="1"
                value={restockQty}
                onChange={(e) => setRestockQty(e.target.value)}
                required
              />
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Restock
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{isAdd ? 'Add vehicle' : 'Edit vehicle'}</h2>
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label htmlFor="v-make">Make</label>
            <input
              id="v-make"
              type="text"
              value={make}
              onChange={(e) => setMake(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="v-model">Model</label>
            <input
              id="v-model"
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="v-category">Category</label>
            <input
              id="v-category"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="v-price">Price (USD)</label>
            <input
              id="v-price"
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="v-qty">Quantity</label>
            <input
              id="v-qty"
              type="number"
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {isAdd ? 'Add vehicle' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
