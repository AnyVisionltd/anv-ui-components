import React, { useRef, useState } from 'react'
import { select } from '@storybook/addon-knobs'
import { centerDecorator } from '../../utils/storybook/decorators'
import { Menu, Button } from '../../index'
import styles from '../../styles/storybook/index.module.scss'

export default {
  title: 'Components/Menu',
  component: Menu,
  decorators: [centerDecorator],
  subcomponents: { Item: Menu.Item }
}

export const Default = () => {
  const ref = useRef()
  const [anchorElement, setAnchorElement] = useState(null)

  const handleMenuClose = () => setAnchorElement(null)
  const handleButtonClick = () => (anchorElement
    ? setAnchorElement(null)
    : setAnchorElement(ref.current))

  return (
    <div className={ styles.menuExample }>

      <Button
        aria-controls="menu-story-default"
        aria-haspopup="true"
        onClick={ handleButtonClick }
        ref={ ref }
      >
        Pizza Toppings
      </Button>

      <Menu
        aria-labelledby="menu-story-default"
        anchorElement={ anchorElement }
        isOpen={ !!anchorElement }
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
  const [anchorElement, setAnchorElement] = useState(null)

  const handleClose = () => setAnchorElement(null)
  const handleButtonClick = event => (anchorElement
    ? setAnchorElement(null)
    : setAnchorElement(event.currentTarget))


  return (
    <div className={ styles.menuExample }>
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

      <div className={ styles.tinyText }>
        Best viewed in canvas mode
      </div>

      <Menu
        aria-labelledby="menu-story"
        anchorElement={ anchorElement }
        isOpen={ !!anchorElement }
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

export const PreferOpenToDirection = () => {
  const ref = useRef()
  const [anchorElement, setAnchorElement] = useState(null)

  const handleClose = () => setAnchorElement(null)
  const handleButtonClick = () => (anchorElement
    ? setAnchorElement(null)
    : setAnchorElement(ref.current))

  const vertical = select('Vertical axis', ['up', 'down'], 'down')
  const horizontal = select('Horizontal axis', ['start', 'end'], 'end')
  const attachAxis = select('Attach axis', ['vertical', 'horizontal'], 'vertical')

  return (
    <div className={ styles.menuExample }>
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
        anchorElement={ anchorElement }
        isOpen={ !!anchorElement }
        onClose={ handleClose }
        preferOpenDirection={ `${vertical}-${horizontal}` }
        attachAxis={ attachAxis }
      >
        <Menu.Item>List Item #1</Menu.Item>
        <Menu.Item>List Item #2</Menu.Item>
      </Menu>

    </div>
  )
}

export const WithSubMenus = () => {
  const ref = useRef()
  const [anchorElement, setAnchorElement] = useState(null)

  const handleMenuClose = () => setAnchorElement(null)
  const handleButtonClick = () => (anchorElement
    ? setAnchorElement(null)
    : setAnchorElement(ref.current))

  return (
    <div className={ styles.menuExample }>

      <Button
        aria-controls="menu-story-submenu"
        aria-haspopup="true"
        onClick={ handleButtonClick }
        ref={ ref }
      >
        Open Menu
      </Button>

      <Menu
        aria-labelledby="menu-story-submenu"
        anchorElement={ anchorElement }
        isOpen={ !!anchorElement }
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
  const regularAnchorElement = useRef()
  const denseAnchorElement = useRef()

  const [regularAnchorElementOpened, setRegularAnchorElementOpened] = useState(null)
  const [denseAnchorElementOpened, setDenseAnchorElementOpened] = useState(null)

  const openRegularMenu = () => (regularAnchorElementOpened
    ? setRegularAnchorElementOpened(null)
    : setRegularAnchorElementOpened(regularAnchorElement.current))
  const openDenseMenu = () => (denseAnchorElementOpened
    ? setDenseAnchorElementOpened(null)
    : setDenseAnchorElementOpened(denseAnchorElement.current))

  const closeRegularMenu = () => setRegularAnchorElementOpened(null)
  const closeDenseMenu = () => setDenseAnchorElementOpened(null)

  return (
    <div className={ styles.menuExample }>
      <div className={ styles.microMargin }>
        <Button
          aria-controls="menu-story-regular"
          aria-haspopup="true"
          onClick={ openRegularMenu }
          ref={ regularAnchorElement }
        >
          Regular
        </Button>
        <Menu
          aria-labelledby="menu-story-regular"
          anchorElement={ regularAnchorElementOpened }
          isOpen={ !!regularAnchorElementOpened }
          onClose={ closeRegularMenu }
        >
          <Menu.Item>Item #1</Menu.Item>
          <Menu.Item>Item #2</Menu.Item>
          <Menu.Item>Item #3</Menu.Item>
          <Menu.Item>Item #4</Menu.Item>
        </Menu>
      </div>
      <div className={ styles.microMargin }>
        <Button
          aria-controls="menu-story-dense"
          aria-haspopup="true"
          onClick={ openDenseMenu }
          ref={ denseAnchorElement }
        >
          Dense
        </Button>
        <Menu
          aria-labelledby="menu-story-dense"
          anchorElement={ denseAnchorElementOpened }
          isOpen={ !!denseAnchorElementOpened }
          onClose={ closeDenseMenu }
          variant="dense"
        >
          <Menu.Item>Item #1</Menu.Item>
          <Menu.Item>Item #2</Menu.Item>
          <Menu.Item>Item #3</Menu.Item>
          <Menu.Item>Item #4</Menu.Item>
        </Menu>
      </div>
    </div>
  )
}
