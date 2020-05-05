import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { Menu } from '.'
import { Button } from '../Button'

describe('<Menu />', () => {
  describe('clicking inside/outside the menu', () => {
    it('click outside the menu should close it', () => {
      const handleClickOutside = jest.fn()
      const { getByRole } = render(
        <>
          <Button>I will click on this button, it should close the opened menu</Button>
          <Menu isOpen onClose={ handleClickOutside }>
            <Menu.Item>Simple menu item</Menu.Item>
          </Menu>
        </>,
      )
      const buttonNode = getByRole('button')
      fireEvent.mouseUp(buttonNode)
      expect(handleClickOutside).toBeCalled()
    })

    it('click within the menu should not close it', () => {
      const handleClickOutside = jest.fn()
      const { getByText } = render(
        <>
          <Menu isOpen onClose={ handleClickOutside }>
            <Menu.Item>Menu item</Menu.Item>
          </Menu>
        </>,
      )
      const menuItemNode = getByText('Menu item')
      fireEvent.mouseUp(menuItemNode)
      expect(handleClickOutside).not.toBeCalled()
    })
  })

  describe('sub menus', () => {
    it('inactive sub-menus shouldn\'t be displayed', () => {
      const { container } = render(
        <Menu isOpen>
          <Menu.SubMenu label="Sub menu label">
            <Menu.Item>Sub menu item</Menu.Item>
          </Menu.SubMenu>
        </Menu>,
      )

      const subMenuInnerHTML = container.querySelector('.subMenuItem > .subMenu')
      expect(subMenuInnerHTML).toBeEmpty()
    })

    it('hovered sub-menus should display the sub menu list', () => {
      const { getByText } = render(
        <Menu isOpen>
          <Menu.SubMenu label="Sub menu label">
            <Menu.Item>Sub menu item</Menu.Item>
          </Menu.SubMenu>
        </Menu>,
      )

      const subMenuItemLabel = getByText('Sub menu label')
      fireEvent.mouseEnter(subMenuItemLabel)
      const subMenuItem = getByText('Sub menu item')
      expect(subMenuItem).toBeInTheDocument()
    })
  })
})
