import StockGauge from './StockGauge'

export default function VehicleRow({
  vehicle,
  isAdmin,
  onPurchase,
  onEdit,
  onRestock,
  onDelete,
}) {
  const outOfStock = vehicle.quantity <= 0

  return (
    <tr>
      <td data-label="Make">{vehicle.make}</td>
      <td data-label="Model">{vehicle.model}</td>
      <td data-label="Category">{vehicle.category}</td>
      <td data-label="Price" className="mono">
        ${vehicle.price.toLocaleString()}
      </td>
      <td data-label="Stock">
        <StockGauge quantity={vehicle.quantity} />
      </td>
      <td data-label="Actions">
        <div className="actions">
          <button
            className="btn btn-primary btn-sm"
            onClick={() => onPurchase(vehicle.id)}
            disabled={outOfStock}
          >
            {outOfStock ? 'Sold out' : 'Buy'}
          </button>

          {isAdmin && (
            <>
              <button className="btn btn-ghost btn-sm" onClick={() => onEdit(vehicle)}>
                Edit
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => onRestock(vehicle)}>
                Restock
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => onDelete(vehicle)}>
                Delete
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  )
}
