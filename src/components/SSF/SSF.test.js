import React from 'react'
import { render, fireEvent, act } from '@testing-library/react'
import SmartFilter from "./SSF"
import { ReactComponent as ArrowSolidRight } from "../../assets/svg/ArrowSolidRight.svg"
import { screen } from "@testing-library/dom"
import keymap from "../../utils/enums/keymap"

const fields = [
  {
    field: 'menuItemText', label: 'Menu Item Text', type: 'string',
  },
  {
    field: 'menuItemIcon', label: 'Menu Item Icon', type: 'string', icon: <ArrowSolidRight />,
  },
  {
    field: 'menuItemNumber', label: 'Menu Item Number', type: 'number',
  }
]

const changeInput = value => {
  const input = screen.getByRole('textbox')
  input.focus()
  fireEvent.change(input, { target: { value } })
  return input
}

const addFreeTextChip = value => {
  const input = changeInput(value)
  fireEvent.keyDown(input, { keyCode: keymap.ENTER })
}

describe('<SSF />', () => {
  describe('auto complete menu', () => {
    it('should open auto complete menu when input focus', async () => {
      const { getByRole } = render(<SmartFilter fields={ fields } />)
      const input = getByRole('textbox')
      await act(async () => input.focus())
      const autoComplete = getByRole('menu')
      expect(autoComplete).toBeTruthy()
    })

    it('should open menu when click filter icon', async () => {
      const { getByRole } = render(<SmartFilter fields={ fields } />)
      const filterIcon = getByRole('button')
      await act(async () => filterIcon.click())
      const autoComplete = getByRole('menu')
      expect(autoComplete).toBeTruthy()
    })

    it('should show menu items that match typing', async () => {
      const { getByRole, getAllByRole } = render(<SmartFilter fields={ fields } />)
      const input = getByRole('textbox')
      await act(async () => input.focus())
      let menuItems = getAllByRole('menuitem')
      expect(menuItems).toHaveLength(3)
      await act(async () => fireEvent.change(input, { target: { value: 'Menu Item Text' } }))
      menuItems = getAllByRole('menuitem')
      expect(menuItems).toHaveLength(1)
    })

    it('should add text from menu to input and validate following inputs', async () => {
      const { getByRole, getAllByRole } = render(<SmartFilter fields={ fields } />)
      const input = getByRole('textbox')
      await act(async () => input.focus())
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

  describe('events', () => {
    it('onChange should return an array with chip objects containing chip field and value', async () => {
      const mockRegularChip = 'Normal Chip'
      const mockFieldChip = 'Example Field'
      const onChange = chipsArr => {
        chipsArr.forEach((chip, index) => {
          expect(typeof chip).toEqual('object')
          if (index === 0) {
            expect(chip.field).toBeUndefined()
            expect(chip.value).toEqual(mockRegularChip)
          } else if (index === 1) {
            expect(chip.value).toEqual(mockFieldChip)
            expect(chip.field).toEqual(fields[2].field)
          }
        })
      }
      await act(async () => {
        const { getAllByRole, getByRole } = render(<SmartFilter fields={ fields } onChange={ await onChange } />)
        addFreeTextChip(mockRegularChip)
        const input = getByRole('textbox')
        let menuItems = getAllByRole('menuitem')
        fireEvent.click(menuItems[2])
        addFreeTextChip(`${input.value}${mockFieldChip}`)
      })
    })
  })
})
