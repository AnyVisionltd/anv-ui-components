import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Accordion from './Accordion'

const mockData = [
  {
    title: 'test_title',
    content: 'test_content',
  },
  {
    title: 'test_disabled',
    content: 'test_disabled',
    disabled: true,
  },
]

describe('<Accordion />', () => {
  it('Should render', () => {
    const { container } = render(<Accordion />)
    expect(container).toBeTruthy()
  })

  it('Should render data items', () => {
    render(<Accordion data={mockData} />)
    const accordionItem = screen.getByTestId('accordion-item-0')
    expect(accordionItem).toBeTruthy()
  })

  it('Should disable second item', () => {
    render(<Accordion data={mockData} />)
    const accordionItem = screen.getByTestId('accordion-item-1')
    expect(accordionItem.classList.contains('disabled')).toBe(true)
  })

  it('Should open first item', () => {
    render(<Accordion data={mockData} />)
    const firstItemTitle = screen.getByTestId('accordion-item-0_title')
    fireEvent.click(firstItemTitle)
    const firstItem = screen.getByTestId('accordion-item-0')
    expect(firstItem.classList.contains('active')).toBe(true)
  })

  it('All items should be open', () => {
    render(<Accordion data={mockData} expandAll />)
    const firstItem = screen.getByTestId('accordion-item-0')
    const secondItem = screen.getByTestId('accordion-item-1')
    expect(firstItem.classList.contains('active')).toBe(true)
    expect(secondItem.classList.contains('active')).toBe(true)
  })
})
