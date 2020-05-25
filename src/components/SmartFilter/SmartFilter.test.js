import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import SmartFilter from "./SmartFilter"
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

const addFreeTextChip = (input, value) => {
  fireEvent.change(input, { target: { value } })
  fireEvent.keyDown(input, { keyCode: 13 })
}

const addFieldsChip = (input, getByText, value) => {
  input.focus()
  const menuItemText = getByText('Menu Item Text')
  menuItemText.click()
  fireEvent.change(input, { target: { value: `${ input.value }${ value }` } })
  fireEvent.keyDown(input, { keyCode: 13 })
}

describe('<SmartFilter />', () => {
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

    it('should show menu items that much typing', () => {
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
      const { getByRole, getAllByText } = render(<SmartFilter />)
      const input = getByRole('textbox')
      addFreeTextChip(input, 'mockData')
      addFreeTextChip(input, 'mockData')
      const chips = getAllByText('mockData')
      expect(chips).toHaveLength(1)
    })

    it('should create chip by auto complete', () => {
      const onChange = jest.fn()
      const { getByRole, getByText } = render(<SmartFilter fields={ fields } onChange={ onChange } />)
      const input = getByRole('textbox')
      addFieldsChip(input, getByText, 'mockData')
      getByText('Menu Item Text: mockData')
      expect(onChange.mock.calls[1][0]).toEqual( [ { field: 'menuItemText', value: 'mockData' }])
    })

    it('should fire onChange with data when chip created', () => {
      const onChange = jest.fn()
      const { getByRole } = render(<SmartFilter onChange={ onChange } />)
      const input = getByRole('textbox')
      addFreeTextChip(input, 'mockData')
      addFreeTextChip(input, 'mockData2')
      // 3 because onChange fire on first render
      expect(onChange).toBeCalledTimes(3)
      expect(onChange.mock.calls[2][0]).toEqual( [ { value: 'mockData' }, { value: 'mockData2' } ] )
    })
  })

  describe('chips deletion', () => {
    it('should delete chip by leading icon', () => {
      const onChange = jest.fn()
      const { debug, getByRole, getAllByRole } = render(<SmartFilter onChange={ onChange }/>)
      const input = getByRole('textbox')
      addFreeTextChip(input, 'mockData')
      const buttons = getAllByRole('button')
      fireEvent.click(buttons[2])
      expect(onChange.mock.calls[2][0]).toEqual([])
    })

    it('should delete all chips', () => {
      const onChange = jest.fn()
      const { getByRole, getAllByRole } = render(<SmartFilter onChange={ onChange }/>)
      const input = getByRole('textbox')
      addFreeTextChip(input, 'mockData')
      addFreeTextChip(input, 'mockData1')
      const buttons = getAllByRole('button')
      fireEvent.click(buttons[5])
      expect(onChange.mock.calls[3][0]).toEqual([])
    })
  })

  describe('keys navigation', () => {

  })
})
