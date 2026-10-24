import { useState } from 'react'

export default function VehicleModal({ modal, onClose, onSave, onDelete, onRestock }) {
  const [make, setMake] = useState(modal.vehicle?.make || '')
  const [model, setModel] = useState(modal.vehicle?.model || '')
  const [category, setCategory] = useState(modal.vehicle?.category || '')
  const [price, setPrice] = useState(modal.vehicle?.price || '')
  const [quantity, setQuantity] = useState(modal.vehicle?.quantity ?? 0)
  const [restockQty, setRestockQty] = useState(1)

  const isAdd = modal.mode === 'add'
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
            <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button className="btn btn-danger" onClick={() => onDelete(modal.vehicle.id)}>
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
              <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary">Restock</button>
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
            <input id="v-make" type="text" value={make}
              onChange={(e) => setMake(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="v-model">Model</label>
            <input id="v-model" type="text" value={model}
              onChange={(e) => setModel(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="v-category">Category</label>
            <input id="v-category" type="text" value={category}
              onChange={(e) => setCategory(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="v-price">Price (USD)</label>
            <input id="v-price" type="number" step="0.01" min="0" value={price}
              onChange={(e) => setPrice(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="v-qty">Quantity</label>
            <input id="v-qty" type="number" min="0" value={quantity}
              onChange={(e) => setQuantity(e.target.value)} required />
          </div>
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              {isAdd ? 'Add vehicle' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
