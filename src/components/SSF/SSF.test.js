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

    it('should add text from menu to input and validate following inputs', () => {
      const { getByRole, getAllByRole } = render(<SmartFilter fields={ fields } />)
      const input = getByRole('textbox')
      let menuItems = getAllByRole('menuitem')
      expect(menuItems).toHaveLength(3)
      fireEvent.click(menuItems[2])
      // input value should be changed after menu item selection
      expect(input.value).toEqual(`${fields[2].label}: `)
      fireEvent.change(input, { target: { value: `${input.value}asda` } })
      // value should not be changed for field of type number if input is not a number
      expect(input.value).toEqual(`${fields[2].label}: `)
      fireEvent.change(input, { target: { value: `${input.value}123` } })
      expect(input.value).toEqual(`${fields[2].label}: 123`)
    })
  })
})
