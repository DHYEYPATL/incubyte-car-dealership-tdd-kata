import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StockGauge from '../components/StockGauge'

describe('StockGauge', () => {
  it('shows the quantity number', () => {
    render(<StockGauge quantity={5} />)
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('applies in-stock class when quantity is above 2', () => {
    const { container } = render(<StockGauge quantity={5} />)
    expect(container.querySelector('.stock-bar-fill')).toHaveClass('in-stock')
  })

  it('applies low class when quantity is 1 or 2', () => {
    const { container } = render(<StockGauge quantity={2} />)
    expect(container.querySelector('.stock-bar-fill')).toHaveClass('low')
  })

  it('applies out class and shows 0 when quantity is 0', () => {
    const { container } = render(<StockGauge quantity={0} />)
    expect(container.querySelector('.stock-bar-fill')).toHaveClass('out')
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('fill width is proportional to quantity (max 10)', () => {
    const { container } = render(<StockGauge quantity={5} />)
    const fill = container.querySelector('.stock-bar-fill')
    expect(fill.style.width).toBe('50%')
  })

  it('fill width is capped at 100% for quantities above 10', () => {
    const { container } = render(<StockGauge quantity={15} />)
    const fill = container.querySelector('.stock-bar-fill')
    expect(fill.style.width).toBe('100%')
  })
})
