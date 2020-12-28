import React, { useState } from 'react'
import { render, fireEvent, act, waitFor, screen } from '@testing-library/react'
import { Menu } from '.'
import { Button } from '../Button'

const MenuWithAnchor = () => {
  const [anchor, setAnchor] = useState()
  return (
    <>
      <Button ref={setAnchor}>button</Button>
      <Menu anchorElement={anchor} isOpen>
        <Menu.Item>Simple menu item</Menu.Item>
        <Menu.Item>Simple menu item</Menu.Item>
      </Menu>
    </>
  )
}

describe('<Menu />', () => {
  let button
  beforeEach(() => {
    button = document.createElement('BUTTON')
  })
  afterEach(() => {
    button.remove()
  })
  describe('clicking inside/outside the menu', () => {
    it("click outside the menu should close it by firing 'on close' event", async () => {
      const handleClose = jest.fn()
      const { getByRole } = render(
        <>
          <Button>
            I will click on this button, it should close the opened menu
          </Button>
          <Menu isOpen onClose={handleClose} anchorElement={button}>
            <Menu.Item>Simple menu item</Menu.Item>
          </Menu>
        </>,
      )
      const buttonNode = getByRole('button')
      await act(async () => await fireEvent.mouseUp(buttonNode))
      expect(handleClose).toBeCalled()
    })

    it('click within the menu should not close it', async () => {
      const handleClickOutside = jest.fn()
      const { getByText } = render(
        <>
          <Menu isOpen onClose={handleClickOutside} anchorElement={button}>
            <Menu.Item>Menu item</Menu.Item>
          </Menu>
        </>,
      )
      const menuItemNode = getByText('Menu item')
      await act(async () => await fireEvent.mouseUp(menuItemNode))
      expect(handleClickOutside).not.toBeCalled()
    })
  })

  describe('sub menus', () => {
    it("inactive sub-menus shouldn't be displayed", async () => {
      const { container } = render(
        <Menu isOpen anchorElement={button}>
          <Menu.SubMenu label='Sub menu label'>
            <Menu.Item>Sub menu item</Menu.Item>
          </Menu.SubMenu>
        </Menu>,
      )

      await act(async () => {
        const subMenuInnerHTML = container.querySelector(
          '.subMenuItem > .subMenu',
        )
        expect(subMenuInnerHTML).toBeEmptyDOMElement()
      })
    })

    it('hovering sub-menu items should display the sub menu', async () => {
      const onOpenedHandler = jest.fn()
      jest.useFakeTimers()

      const { getByText } = render(
        <Menu isOpen anchorElement={button}>
          <Menu.SubMenu onOpened={onOpenedHandler} label='Sub menu label'>
            <Menu.Item>Sub menu item</Menu.Item>
          </Menu.SubMenu>
        </Menu>,
      )

      const subMenuItemLabel = getByText('Sub menu label')
      await act(async () => await fireEvent.mouseEnter(subMenuItemLabel))
      const subMenuItem = getByText('Sub menu item')
      expect(subMenuItem).toBeInTheDocument()
      jest.advanceTimersByTime(500) // Wait for the animation to be completed
      expect(onOpenedHandler).toBeCalled()
    })

    it('leaving the sub menu list item should hide the sub menu', async () => {
      const onClosedHandler = jest.fn()
      jest.useFakeTimers()

      const { getByText } = render(
        <Menu isOpen anchorElement={button}>
          <Menu.SubMenu onClosed={onClosedHandler} label='Sub menu label'>
            <Menu.Item>Sub menu item</Menu.Item>
          </Menu.SubMenu>
        </Menu>,
      )

      const subMenuItemLabel = getByText('Sub menu label')
      await act(async () => await fireEvent.mouseEnter(subMenuItemLabel))
      const subMenuItem = getByText('Sub menu item')
      await act(async () => await fireEvent.mouseLeave(subMenuItem))
      jest.advanceTimersByTime(500) // Wait for the animation to be completed
      expect(onClosedHandler).toBeCalled()
      expect(subMenuItem).not.toBeInTheDocument()
    })
  })

  describe('keydown navigation', () => {
    it("ESCAPE key should close the menu by firing 'on close' event", async () => {
      const handleClose = jest.fn()
      render(
        <>
          <Menu isOpen onClose={handleClose} anchorElement={button}>
            <Menu.Item>Simple menu item</Menu.Item>
          </Menu>
        </>,
      )
      await act(async () => await fireEvent.keyDown(document, { keyCode: 27 }))
      expect(handleClose).toBeCalled()
    })

    it('Arrow Down key should focus the first > second > anchor > first <Menu.Item/>', async () => {
      const { getAllByRole } = render(<MenuWithAnchor />)
      await waitFor(() => {})
      const anchor = screen.getByRole('button')
      fireEvent.click(anchor)
      const [firstMenuItem, secondMenuItem] = getAllByRole('menuitem')
      fireEvent.keyDown(document, { keyCode: 40 })
      expect(document.activeElement).toBe(firstMenuItem)
      fireEvent.keyDown(document, { keyCode: 40 })
      expect(document.activeElement).toBe(secondMenuItem)
      fireEvent.keyDown(document, { keyCode: 40 })
      expect(document.activeElement).toBe(anchor)
      fireEvent.keyDown(document, { keyCode: 40 })
      expect(document.activeElement).toBe(firstMenuItem)
    })

    it('Arrow Up key should focus the last <Menu.Item/>', async () => {
      const { getAllByRole } = render(<MenuWithAnchor />)
      await waitFor(() => {})
      const anchor = screen.getByRole('button')
      fireEvent.click(anchor)
      const [firstMenuItem, secondMenuItem] = getAllByRole('menuitem')
      fireEvent.keyDown(document, { keyCode: 38 })
      expect(document.activeElement).toBe(secondMenuItem)
      fireEvent.keyDown(document, { keyCode: 38 })
      expect(document.activeElement).toBe(firstMenuItem)
      fireEvent.keyDown(document, { keyCode: 38 })
      expect(document.activeElement).toBe(anchor)
      fireEvent.keyDown(document, { keyCode: 38 })
      expect(document.activeElement).toBe(secondMenuItem)
    })
  })
})
