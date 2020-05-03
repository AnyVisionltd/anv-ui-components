import React, { useRef, useState } from 'react'
import { centerDecorator } from '../../utils/storybook/decorators'
import { Button } from '../Button'
import Menu from '.'
import styles from '../../styles/storybook/index.module.scss'

export default {
  title: 'Components/Menu',
  component: Menu,
  decorators: [centerDecorator],
}

export const Default = () => {
  const ref = useRef()
  const [isOpen, setIsOpen] = useState(false)

  const handleMenuClose = () => setIsOpen(false)
  const handleButtonClick = () => setIsOpen(true)

  return (
    <div className={ styles.microMargin }>

      <Button
        aria-controls="menu-story"
        aria-haspopup="true"
        onClick={ handleButtonClick }
        ref={ ref }
      >
        Pizza Toppings
      </Button>

      <Menu
        aria-labelledby="menu-story"
        controllingElementRef={ ref.current }
        isOpen={ isOpen }
        onClose={ handleMenuClose }
      >
        <Menu.Item>Extra cheese</Menu.Item>
        <Menu.Item>Tomatoes</Menu.Item>
        <Menu.Item>Onions</Menu.Item>
        <Menu.Item>NOT pineapple.</Menu.Item>
      </Menu>

    </div>
  )
}

export const DifferentPositions = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [isOpen, setIsOpen] = useState(false)

  const handleClose = () => setIsOpen(false)
  const handleButtonClick = (event) => {
    if (isOpen) {
      return handleClose()
    }
    setAnchorEl(event.currentTarget)
    return setIsOpen(true)
  }

  return (
    <div className={ styles.microMargin }>
      <Button
        style={ { position: 'absolute', top: 10, left: 10 } }
        aria-controls="menu-story"
        aria-haspopup="true"
        onClick={ handleButtonClick }
      >
        Top, Left
      </Button>

      <Button
        style={ { position: 'absolute', top: 10, right: 10 } }
        aria-controls="menu-story"
        aria-haspopup="true"
        onClick={ handleButtonClick }
      >
        Top, Right
      </Button>

      <Button
        style={ { position: 'absolute', bottom: 10, left: 10 } }
        aria-controls="menu-story"
        aria-haspopup="true"
        onClick={ handleButtonClick }
      >
        Bottom, Left
      </Button>

      <Button
        style={ { position: 'absolute', bottom: 10, right: 10 } }
        aria-controls="menu-story"
        aria-haspopup="true"
        onClick={ handleButtonClick }
      >
        Bottom, Right
      </Button>

      <Menu
        aria-labelledby="menu-story"
        controllingElementRef={ anchorEl }
        isOpen={ isOpen }
        onClose={ handleClose }
      >
        <Menu.Item>List Item #1</Menu.Item>
        <Menu.Item>List Item #2</Menu.Item>
        <Menu.Item>List Item #4</Menu.Item>
        <Menu.Item>List Item #4</Menu.Item>
      </Menu>

    </div>
  )
}

export const WithSubMenus = () => {
  const ref = useRef()
  const [isOpen, setIsOpen] = useState(false)

  const handleMenuClose = () => setIsOpen(false)
  const handleButtonClick = () => setIsOpen(true)

  return (
    <div className={ styles.microMargin }>

      <Button
        aria-controls="menu-story"
        aria-haspopup="true"
        onClick={ handleButtonClick }
        ref={ ref }
      >
        Open Menu
      </Button>

      <Menu
        aria-labelledby="menu-story"
        controllingElementRef={ ref.current }
        isOpen={ isOpen }
        onClose={ handleMenuClose }
      >
        <Menu.Item>List Item #1</Menu.Item>
        <Menu.Item>List Item #2</Menu.Item>
        <Menu.SubMenu label="Sub menu #1">
          <Menu.Item>Item #1</Menu.Item>
          <Menu.Item>Item #2</Menu.Item>
          <Menu.SubMenu label="Sub menu #2">
            <Menu.Item>Item #1</Menu.Item>
            <Menu.Item>Item #2</Menu.Item>
            <Menu.Item>Item #3</Menu.Item>
            <Menu.Item>Item #4</Menu.Item>
          </Menu.SubMenu>
        </Menu.SubMenu>
        <Menu.Item>List Item #4</Menu.Item>
      </Menu>

    </div>
  )
}

export const Variants = () => {
  const regularControllingElementRef = useRef()
  const denseControllingElementRef = useRef()

  const [isRegularMenuOpened, setRegularMenuOpened] = useState(false)
  const [isDenseMenuOpened, setDenseMenuOpened] = useState(false)

  const openRegularMenu = () => setRegularMenuOpened(true)
  const openDenseMenu = () => setDenseMenuOpened(true)

  const closeRegularMenu = () => setRegularMenuOpened(false)
  const closeDenseMenu = () => setDenseMenuOpened(false)

  return (
    <div className={ styles.microMargin }>
      <Button
        aria-controls="menu-story-regular"
        aria-haspopup="true"
        onClick={ openRegularMenu }
        className={ styles.microMargin }
        ref={ regularControllingElementRef }
      >
        Regular
      </Button>

      <Menu
        aria-labelledby="menu-story-regular"
        controllingElementRef={ regularControllingElementRef.current }
        isOpen={ isRegularMenuOpened }
        onClose={ closeRegularMenu }
      >
        <Menu.Item>Item #1</Menu.Item>
        <Menu.Item>Item #2</Menu.Item>
        <Menu.Item>Item #3</Menu.Item>
        <Menu.Item>Item #4</Menu.Item>
      </Menu>

      <Button
        aria-controls="menu-story-dense"
        aria-haspopup="true"
        onClick={ openDenseMenu }
        className={ styles.microMargin }
        ref={ denseControllingElementRef }
      >
        Dense
      </Button>

      <Menu
        aria-labelledby="menu-story-dense"
        controllingElementRef={ denseControllingElementRef.current }
        isOpen={ isDenseMenuOpened }
        onClose={ closeDenseMenu }
        variant="dense"
      >
        <Menu.Item>Item #1</Menu.Item>
        <Menu.Item>Item #2</Menu.Item>
        <Menu.Item>Item #3</Menu.Item>
        <Menu.Item>Item #4</Menu.Item>
      </Menu>
    </div>
  )
}
