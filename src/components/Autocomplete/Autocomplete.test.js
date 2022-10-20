import React from 'react'
import { screen, render, fireEvent } from '@testing-library/react'
import Autocomplete from './Autocomplete'

const results = [
  { value: 'Banana', id: 1 },
  { value: 'Apple', id: 2 },
  { value: 'Mango', id: 3, disabled: true },
  { value: 'Blueberry', id: 4 },
  { value: 'Cucumber', id: 5 },
  { value: 'Olives', id: 6, disabled: true },
  { value: 'Parsley', id: 7 },
  { value: 'Berries', id: 8 },
  { value: 'Raspberry', id: 9 },
  { value: 'Strawberry', id: 10 },
  { value: 'Watermelon', id: 11 },
  { value: 'Kiwi', id: 12 },
  { value: 'Very very very very very very very long paragraph', id: 13 },
]

describe('<Autocomplete/>', () => {
  describe('single selected option dropdown', () => {
    it('should render correctly', () => {
      const { container } = render(<Autocomplete />)
      const labelNode = container.querySelector('label')
      expect(labelNode).toBeTruthy()
      const pNode = container.querySelector('p')
      expect(pNode).toBeTruthy()
      const btnNode = container.querySelector('button')
      expect(btnNode).toBeTruthy()
      const inputNode = container.querySelector('input')
      expect(inputNode).not.toBeTruthy()
    })

    it('should find a correct text value', () => {
      const defaultValue = results[0]
      const label = 'Fruits'
      render(
        <Autocomplete
          options={results}
          label={label}
          defaultValue={defaultValue}
        />,
      )
      const selectedValueText = screen.getByText(defaultValue.value)
      expect(selectedValueText).toBeTruthy()
      const labelText = screen.getByText(label)
      expect(labelText).toBeTruthy()
    })
  })

  describe('testing prop callbacks', () => {
    it('should open menu when clicking on selectedCotainer', () => {
      const onMenuOpen = jest.fn()
      const onMenuClose = jest.fn()
      const { getByRole } = render(
        <Autocomplete onMenuOpen={onMenuOpen} onMenuClose={onMenuClose} />,
      )
      const toggleMenuBtn = getByRole('button')
      fireEvent.click(toggleMenuBtn)
      expect(onMenuOpen).toHaveBeenCalled()
      // Now menu is open so we can close
      fireEvent.click(toggleMenuBtn)
      expect(onMenuClose).toHaveBeenCalled()
    })
  })

  it('should call onSelect when one of the when delete button is clicked', () => {
    const onSelect = jest.fn()
    render(
      <Autocomplete
        options={results}
        defaultValue={results[0]}
        onSelect={onSelect}
      />,
    )

    const deleteBtn = screen.getByTestId('autocomplete-delete-btn')
    fireEvent.click(deleteBtn)
    expect(onSelect).toHaveBeenCalledTimes(1)
  })

  describe('testing Autocomplete`s isDisabled', () => {
    it('should not open menu when clicking on container', () => {
      const onMenuOpen = jest.fn()
      const { container } = render(
        <Autocomplete onMenuOpen={onMenuOpen} isDisabled />,
      )
      const toggleMenuButton = container.querySelector('button')
      fireEvent.click(toggleMenuButton)
      expect(onMenuOpen).not.toHaveBeenCalled()
    })
  })

  describe('testing keyValue and displayValue props', () => {
    it('should display the right displayValue although the default is `value`', () => {
      const arr = [{ item: 'test', myId: '1' }]
      const { getByText } = render(
        <Autocomplete
          options={arr}
          defaultValue={arr[0]}
          keyValue='myId'
          displayValue='item'
        />,
      )
      const selectedValueText = getByText(arr[0].item)
      expect(selectedValueText).toBeTruthy()
    })
  })
})
