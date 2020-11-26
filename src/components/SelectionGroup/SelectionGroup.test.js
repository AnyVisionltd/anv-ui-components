import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import SelectionGroup from './SelectionGroup'

describe('<SelectionGroup />', () => {
  it('should call onChange when selected value changed', () => {
    const handleOnChange = jest.fn()
    render(
      <SelectionGroup onChange={handleOnChange}>
        <SelectionGroup.Item value={123}>mock</SelectionGroup.Item>
        <SelectionGroup.Item value={456}>mock2</SelectionGroup.Item>
      </SelectionGroup>,
    )
    const node = screen.getByText('mock')
    const node2 = screen.getByText('mock2')
    fireEvent.click(node)
    expect(handleOnChange.mock.calls[0][0]).toBe(123)
    fireEvent.click(node)
    expect(handleOnChange.mock.calls.length).toBe(1)
    fireEvent.click(node2)
    expect(handleOnChange.mock.calls[1][0]).toBe(456)
  })

  it('should value change selected', () => {
    const { container } = render(
      <SelectionGroup value={123} defaultValue={123}>
        <SelectionGroup.Item value={123}>mock</SelectionGroup.Item>
        <SelectionGroup.Item value={456}>mock2</SelectionGroup.Item>
      </SelectionGroup>,
    )
    const node = container.querySelector('.active')
    expect(node.firstChild.innerHTML).toBe('mock')
  })

  it('should prevent change when group disabled', () => {
    const handleOnChange = jest.fn()
    render(
      <SelectionGroup disabled onChange={handleOnChange}>
        <SelectionGroup.Item value={123}>mock</SelectionGroup.Item>
        <SelectionGroup.Item value={456}>mock2</SelectionGroup.Item>
      </SelectionGroup>,
    )
    const node = screen.getByText('mock')
    fireEvent.click(node)
    expect(handleOnChange.mock.calls.length).toBe(0)
  })

  it('should prevent change when item disabled', () => {
    const handleOnChange = jest.fn()
    render(
      <SelectionGroup onChange={handleOnChange}>
        <SelectionGroup.Item disabled value={123}>
          mock
        </SelectionGroup.Item>
        <SelectionGroup.Item value={456}>mock2</SelectionGroup.Item>
      </SelectionGroup>,
    )
    const node = screen.getByText('mock')
    fireEvent.click(node)
    expect(handleOnChange.mock.calls.length).toBe(0)
  })
})
