import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import VehicleRow from '../components/VehicleRow'

const baseVehicle = {
  id: 1,
  make: 'Toyota',
  model: 'Camry',
  category: 'Sedan',
  price: 25000,
  quantity: 5,
}

describe('VehicleRow', () => {
  it('renders make, model, category and price', () => {
    render(
      <table><tbody>
        <VehicleRow vehicle={baseVehicle} isAdmin={false} onPurchase={() => {}} />
      </tbody></table>
    )
    expect(screen.getByText('Toyota')).toBeInTheDocument()
    expect(screen.getByText('Camry')).toBeInTheDocument()
    expect(screen.getByText('Sedan')).toBeInTheDocument()
    expect(screen.getByText('$25,000')).toBeInTheDocument()
  })

  it('Buy button is enabled when quantity > 0', () => {
    render(
      <table><tbody>
        <VehicleRow vehicle={baseVehicle} isAdmin={false} onPurchase={() => {}} />
      </tbody></table>
    )
    expect(screen.getByRole('button', { name: 'Buy' })).not.toBeDisabled()
  })

  it('Buy button is disabled when quantity is 0', () => {
    render(
      <table><tbody>
        <VehicleRow
          vehicle={{ ...baseVehicle, quantity: 0 }}
          isAdmin={false}
          onPurchase={() => {}}
        />
      </tbody></table>
    )
    expect(screen.getByRole('button', { name: /sold out/i })).toBeDisabled()
  })

  it('calls onPurchase with vehicle id when Buy is clicked', async () => {
    const onPurchase = vi.fn()
    render(
      <table><tbody>
        <VehicleRow vehicle={baseVehicle} isAdmin={false} onPurchase={onPurchase} />
      </tbody></table>
    )
    await userEvent.click(screen.getByRole('button', { name: 'Buy' }))
    expect(onPurchase).toHaveBeenCalledWith(1)
  })

  it('shows Edit, Restock, Delete buttons only for admin', () => {
    render(
      <table><tbody>
        <VehicleRow vehicle={baseVehicle} isAdmin={true} onPurchase={() => {}} onEdit={() => {}} onRestock={() => {}} onDelete={() => {}} />
      </tbody></table>
    )
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Restock' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
  })

  it('does not show Edit, Restock, Delete buttons for non-admin', () => {
    render(
      <table><tbody>
        <VehicleRow vehicle={baseVehicle} isAdmin={false} onPurchase={() => {}} />
      </tbody></table>
    )
    expect(screen.queryByRole('button', { name: 'Edit' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Restock' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument()
  })
})
