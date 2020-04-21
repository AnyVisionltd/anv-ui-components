import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import Button from './Button'

describe('<Button />', () => {
  it('should render children into button', () => {
    const { getByRole } = render(<Button>Button Text</Button>)
    const node = getByRole('button')
    expect(node.innerHTML).toBe('Button Text')
  })

  it('should render startIcon', () => {

  })

  describe('disabled', () => {
    it('should not be disabled by default', () => {
      const { getByRole } = render(<Button>Button Text</Button>)
      const node = getByRole('button')
      expect(node.disabled).toBe(false)
    })

    it('should be disabled when disabled pass', () => {
      const { getByRole } = render(<Button disabled>Button Text</Button>)
      const node = getByRole('button')
      expect(node).toBeDisabled()
    })
  })

  it('should call onClick', () => {
    const handleClick = jest.fn()
    const { getByText } = render(
      <Button onClick={ handleClick }>Click Me</Button>,
    )
    const node = getByText('Click Me')
    fireEvent.click(node)
    expect(handleClick).toBeCalled()
  })

  it('should render button with correct default classNames', () => {
    const { getByRole } = render(<Button>Button Text</Button>)
    const node = getByRole('button')
    expect(node).toHaveClass('large')
    expect(node).toHaveClass('primary-fill')
  })
})
