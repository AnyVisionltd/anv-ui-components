import React from 'react'
import { screen, render, fireEvent } from '@testing-library/react'
import Dropdown from './Dropdown'

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
  describe('single selected option dropdown', () => {
    it('should render correctly', () => {
      const { container } = render(<Dropdown />)
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

  describe('multi value dropdown', () => {
    it('should have the correct default values` length with isSelectedShownInHeader is set to false', () => {
      render(
        <Dropdown
          options={fruits}
          multiple
          label='Fruits'
          isSelectedShownInHeader={false}
          defaultValues={fruits}
        />,
      )

      const itemsSelected = 'Items Selected'
      const selectedValueText = screen.getByText(
        `${fruits.length} ${itemsSelected}`,
      )
      expect(selectedValueText).toBeTruthy()
    })

    it('should have the correct default values` length with isSelectedShownInHeader is set to true', () => {
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
      // +2 for delete button and toggle
      const expected = fruits.length + 2
      expect(buttons.length).toBe(expected)
    })
  })

  describe('testing dropdown`s isSearchable', () => {
    it('input is shown when container is clicked in default', () => {
      const { container } = render(<Dropdown />)
      const inputNodeFirstTime = container.querySelector('input')
      expect(inputNodeFirstTime).not.toBeInTheDocument()
      const pNode = container.querySelector('p')
      fireEvent.click(pNode)
      const inputNodeSecondTime = container.querySelector('input')
      expect(inputNodeSecondTime).toBeInTheDocument()
    })

    it('input is not shown when isSearchable is set to false', () => {
      const { container } = render(<Dropdown isSearchable={false} />)
      const inputNodeFirstTime = container.querySelector('input')
      expect(inputNodeFirstTime).not.toBeInTheDocument()
      const pNode = container.querySelector('p')
      fireEvent.click(pNode)
      const inputNodeSecondTime = container.querySelector('input')
      expect(inputNodeSecondTime).not.toBeInTheDocument()
    })
  })

  describe('testing prop callbacks', () => {
    it('should open menu when clicking on selectedCotainer', () => {
      const onMenuOpen = jest.fn()
      const onMenuClose = jest.fn()
      const { getByRole } = render(
        <Dropdown onMenuOpen={onMenuOpen} onMenuClose={onMenuClose} />,
      )
      const toggleMenuBtn = getByRole('button')
      fireEvent.click(toggleMenuBtn)
      expect(onMenuOpen).toHaveBeenCalled()
      // Now menu is open so we can close
      fireEvent.click(toggleMenuBtn)
      expect(onMenuClose).toHaveBeenCalled()
    })

    it('should call onChange when one of the buttons (either delete button or options` buttons) is clicked', () => {
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
      expect(onChange).toHaveBeenCalledTimes(1)

      const deleteButton = buttons[0]
      fireEvent.click(deleteButton)
      expect(onChange).toHaveBeenCalledTimes(2)
    })
  })

  describe('testing Dropdown`s isDisabled', () => {
    it('should not open menu when clicking on container', () => {
      const onMenuOpen = jest.fn()
      const { container } = render(
        <Dropdown onMenuOpen={onMenuOpen} isDisabled />,
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
        <Dropdown
          options={arr}
          defaultValues={[arr[0]]}
          keyValue='myId'
          displayValue='item'
        />,
      )
      const selectedValueText = getByText(arr[0].item)
      expect(selectedValueText).toBeTruthy()
    })
  })
})

describe('testing Dropdown`s error state', () => {
  it('should display the error message', () => {
    const onMenuOpen = jest.fn()
    const errorMessage = 'some error message'
    const { getByText } = render(
      <Dropdown onMenuOpen={onMenuOpen} error message={errorMessage} />,
    )
    expect(getByText(errorMessage)).toBeTruthy()
    expect(getByText(errorMessage).classList.contains('error')).toBeTruthy()
  })
})
