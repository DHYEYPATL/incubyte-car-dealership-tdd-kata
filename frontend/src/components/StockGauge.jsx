export default function StockGauge({ quantity, max = 10 }) {
  function stockClass() {
    if (quantity <= 0) return 'out'
    if (quantity <= 2) return 'low'
    return 'in-stock'
  }

  const fillWidth = `${Math.min((quantity / max) * 100, 100)}%`
  const cls = stockClass()

  return (
    <div className="stock-gauge">
      <div className="stock-bar">
        <div
          className={`stock-bar-fill ${cls}`}
          style={{ width: fillWidth }}
        />
      </div>
      <span className={`stock-number ${cls === 'out' ? 'out' : ''}`}>
        {quantity}
      </span>
    </div>
  )
}
