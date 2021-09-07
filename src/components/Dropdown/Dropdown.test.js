import React from 'react'
import { screen, render, fireEvent } from '@testing-library/react'
import Dropdown from './Dropdown'
import languageService from '../../services/language'

const fruits = [
  { value: 'Banana', id: 1 },
  { value: 'Apple', id: 2 },
  { value: 'Mango', id: 3 },
  { value: 'Blueberry', id: 4 },
  { value: 'Cucumber', id: 5 },
  { value: 'Olives', id: 6 },
  { value: 'Parsley', id: 7 },
  { value: 'Berries', id: 8 },
  { value: 'Raspberry', id: 9 },
  { value: 'Strawberry', id: 10 },
  { value: 'Watermelon', id: 11 },
  { value: 'Kiwi', id: 12 },
]

const genders = [
  { value: 'Male', id: 1 },
  { value: 'Female', id: 2 },
]

describe('<Dropdown/>', () => {
  describe('Single selected option dropdown', () => {
    it('should render correctly', () => {
      const { container } = render(<Dropdown />)
      const labelNode = container.querySelector('label')
      expect(labelNode).toBeTruthy()
      const pNode = container.querySelector('p')
      expect(pNode).toBeTruthy()
      const svgNode = container.querySelector('svg')
      expect(svgNode).toBeTruthy()
      const inputNode = container.querySelector('input')
      expect(inputNode).not.toBeTruthy()
    })

    it('should find a correct text value', () => {
      const defaultValue = genders[0]
      const label = 'Gender'
      render(
        <Dropdown
          options={genders}
          label={label}
          defaultValues={[defaultValue]}
        />,
      )
      const selectedValueText = screen.getByText(defaultValue.value)
      expect(selectedValueText).toBeTruthy()
      const labelText = screen.getByText(label)
      expect(labelText).toBeTruthy()
    })
  })

  describe('Multi value dropdown', () => {
    it('should have the correct default values` length with isSelectedShownInHeader set to false', () => {
      render(
        <Dropdown
          options={fruits}
          multiple
          label='Fruits'
          isSelectedShownInHeader={false}
          defaultValues={fruits}
        />,
      )

      const itemsSelected = languageService.getTranslation('itemsSelected')
      const selectedValueText = screen.getByText(
        `${fruits.length} ${itemsSelected}`,
      )
      expect(selectedValueText).toBeTruthy()
    })

    it('should have the correct default values` length with isSelectedShownInHeader set to true', () => {
      render(
        <Dropdown
          options={fruits}
          multiple
          label='Fruits'
          isSelectedShownInHeader
          defaultValues={fruits}
        />,
      )

      const buttons = screen.getAllByRole('button')
      // 1 for delete button
      const expected = fruits.length + 1
      expect(buttons.length).toBe(expected)
    })
  })

  describe('testing prop callbacks', () => {
    it('should open menu when clicking on selectedCotainer', () => {
      const onMenuOpen = jest.fn()
      const onMenuClose = jest.fn()
      const { container } = render(
        <Dropdown onMenuOpen={onMenuOpen} onMenuClose={onMenuClose} />,
      )
      const toggleMenuIcon = container.querySelector('svg')
      fireEvent.click(toggleMenuIcon)
      expect(onMenuOpen).toHaveBeenCalled()
      // Now menu is open so we can close
      fireEvent.click(toggleMenuIcon)
      expect(onMenuClose).toHaveBeenCalled()
    })

    it('should call onChange when one of the buttons (either delete button or options buttons) is clicked', () => {
      const onChange = jest.fn()
      render(
        <Dropdown
          options={fruits}
          multiple
          isSelectedShownInHeader
          defaultValues={fruits}
          onChange={onChange}
        />,
      )

      const buttons = screen.getAllByRole('button')
      const someOptionButton = buttons[1]
      fireEvent.click(someOptionButton)
      expect(onChange).toHaveBeenCalled()

      const deleteButton = buttons[0]
      fireEvent.click(deleteButton)
      expect(onChange).toHaveBeenCalled()
    })
  })
})
