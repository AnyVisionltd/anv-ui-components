import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { screen } from "@testing-library/dom"
import SmartFilter from "./SSF"
import { ReactComponent as ArrowSolidRight } from "../../assets/svg/ArrowSolidRight.svg"

const fields = [
  {
    field: 'menuItemText', label: 'Menu Item Text', type: 'text',
  },
  {
    field: 'menuItemIcon', label: 'Menu Item Icon', type: 'text', icon: <ArrowSolidRight />,
  },
  {
    field: 'menuItemNumber', label: 'Menu Item Number', type: 'number',
  }
]

const addFreeTextChip = value => {
  const input = screen.getByRole('textbox')
  fireEvent.change(input, { target: { value } })
  fireEvent.keyDown(input, { keyCode: 13 })
}

const addFieldsChip = (getByText, value) => {
  const input = screen.getByRole('textbox')
  input.focus()
  const menuItemText = getByText('Menu Item Text')
  menuItemText.click()
  fireEvent.change(input, { target: { value: `${ input.value }${ value }` } })
  fireEvent.keyDown(input, { keyCode: 13 })
}

describe('<SSF />', () => {
  describe('auto complete menu', () => {
    it('should open auto complete menu when input focus', () => {
      const { getByRole } = render(<SmartFilter fields={ fields } />)
      const input = getByRole('textbox')
      input.focus()
      const autoComplete = getByRole('menu')
      expect(autoComplete).toBeTruthy()
    })

    it('should open menu when click filter icon', () => {
      const { getByRole } = render(<SmartFilter fields={ fields } />)
      const filterIcon = getByRole('button')
      filterIcon.click()
      const autoComplete = getByRole('menu')
      expect(autoComplete).toBeTruthy()
    })

    it('should show menu items that match typing', () => {
      const { getByRole, getAllByRole } = render(<SmartFilter fields={ fields } />)
      const input = getByRole('textbox')
      input.focus()
      let menuItems = getAllByRole('menuitem')
      expect(menuItems).toHaveLength(3)
      fireEvent.change(input, { target: { value: 'Menu Item Text' } })
      menuItems = getAllByRole('menuitem')
      expect(menuItems).toHaveLength(1)
    })
  })

  describe('chips creation', () => {
    it('should create unique free text chip', () => {
      const { getAllByText } = render(<SmartFilter />)
      addFreeTextChip('mockData')
      addFreeTextChip('mockData')
      const chips = getAllByText('mockData')
      expect(chips).toHaveLength(1)
    })

    it('should create chip by auto complete', () => {
      const onChange = jest.fn()
      const { getByText } = render(<SmartFilter fields={ fields } onChange={ onChange } />)
      addFieldsChip(getByText, 'mockData')
      getByText('Menu Item Text: mockData')
      expect(onChange.mock.calls[1][0]).toEqual( [ { field: 'menuItemText', value: 'mockData' }])
    })

    it('should fire onChange with data when chip created', () => {
      const onChange = jest.fn()
      render(<SmartFilter onChange={ onChange } />)
      addFreeTextChip('mockData')
      addFreeTextChip('mockData2')
      // 3 because onChange fire on first render
      expect(onChange).toBeCalledTimes(3)
      expect(onChange.mock.calls[2][0]).toEqual( [ { value: 'mockData' }, { value: 'mockData2' } ] )
    })
  })

  describe('chips deletion', () => {
    it('should delete chip by leading icon', () => {
      const onChange = jest.fn()
      const { getAllByRole } = render(<SmartFilter onChange={ onChange }/>)
      addFreeTextChip('mockData')
      const buttons = getAllByRole('button')
      fireEvent.click(buttons[2])
      expect(onChange.mock.calls[2][0]).toEqual([])
    })

    it('should delete all chips', () => {
      const onChange = jest.fn()
      const { getByLabelText } = render(<SmartFilter onChange={ onChange }/>)
      addFreeTextChip('mockData')
      addFreeTextChip('mockData1')
      const removeAllButton = getByLabelText('remove all')
      fireEvent.click(removeAllButton)
      expect(onChange.mock.calls[3][0]).toEqual([])
    })
  })

  describe('keys navigation', () => {
    it('should remove last chip when BACKSPACE and input cursor on start ', () => {
      const onChange = jest.fn()
      const { getByRole } = render(<SmartFilter onChange={ onChange } />)
      const input = getByRole('textbox')
      addFreeTextChip('mockData')
      input.focus()
      fireEvent.keyDown(input, { keyCode: 8 })
      expect(onChange.mock.calls[2][0]).toEqual([])
    })

    it('should arrow left/right should focus chips', () => {
      const { getByRole, getAllByTestId } = render(<SmartFilter />)
      const input = getByRole('textbox')
      addFreeTextChip('mockData')
      addFreeTextChip('mockData2')
      fireEvent.keyDown(input, { keyCode: 37 })
      const chips = getAllByTestId('chip')
      const [firstChip,secondChip] = chips
      expect(document.activeElement).toBe(secondChip)
      fireEvent.keyDown(input, { keyCode: 37 })
      expect(document.activeElement).toBe(firstChip)
      fireEvent.keyDown(input, { keyCode: 37 })
      expect(document.activeElement).toBe(firstChip)
      fireEvent.keyDown(input, { keyCode: 39 })
      expect(document.activeElement).toBe(secondChip)
      fireEvent.keyDown(input, { keyCode: 39 })
      expect(document.activeElement).toBe(input)
    })
  })
})
