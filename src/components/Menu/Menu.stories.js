import React, { useState } from 'react'
import { centerDecorator } from '../../utils/storybook/decorators'
import { Button } from '../Button'
import Menu from '.'
import styles from '../../styles/storybook/index.module.scss'

export default {
  title: 'Components/Menu',
  component: Menu,
  decorators: [centerDecorator],
}

export const Default = () => (
  <div className={ styles.menuExampleContainer }>
    <Menu
      ariaLabelledby="menu-story"
      isOpen
    >
      <Menu.Item>List Item #1</Menu.Item>
      <Menu.Item>List Item #2</Menu.Item>
      <Menu.Item>List Item #3</Menu.Item>
      <Menu.Item>List Item #4</Menu.Item>
    </Menu>
  </div>
)

export const DifferentPositions = () => {
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClose = () => setAnchorEl(null)

  const handleClick = (event) => (anchorEl
    ? handleClose(event)
    : setAnchorEl(event.currentTarget))

  return (
    <div className={ styles.menuExampleContainer }>
      <Button
        style={ { position: 'absolute', top: 10, left: 10 } }
        aria-controls="menu-story"
        aria-haspopup="true"
        onClick={ handleClick }
      >
        Top, Left
      </Button>

      <Button
        style={ { position: 'absolute', top: 10, right: 10 } }
        aria-controls="menu-story"
        aria-haspopup="true"
        onClick={ handleClick }
      >
        Top, Right
      </Button>

      <Button
        style={ { position: 'absolute', bottom: 10, left: 10 } }
        aria-controls="menu-story"
        aria-haspopup="true"
        onClick={ handleClick }
      >
        Bottom, Left
      </Button>

      <Button
        style={ { position: 'absolute', bottom: 10, right: 10 } }
        aria-controls="menu-story"
        aria-haspopup="true"
        onClick={ handleClick }
      >
        Bottom, Right
      </Button>

      <Menu
        ariaLabelledby="menu-story"
        controllingElementRef={ anchorEl }
        isOpen={ !!anchorEl }
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
  const [anchorEl, setAnchorEl] = useState(null)

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleButtonClick = (event) => (anchorEl
    ? handleMenuClose(event)
    : setAnchorEl(event.currentTarget))

  return (
    <div className={ styles.menuExampleContainer }>

      <Button
        aria-controls="menu-story"
        aria-haspopup="true"
        onClick={ handleButtonClick }
      >
        Open Menu
      </Button>

      <Menu
        ariaLabelledby="menu-story"
        controllingElementRef={ anchorEl }
        isOpen={ !!anchorEl }
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
  const [anchorRegular, setAnchorRegular] = useState(null)
  const [anchorDense, setAnchorDense] = useState(null)

  const handleRegularMenuClose = () => setAnchorRegular(null)
  const handleRegularButtonClick = (event) => (anchorRegular
    ? handleRegularButtonClick(event)
    : setAnchorRegular(event.currentTarget))

  const handleDenseMenuClose = () => setAnchorDense(null)
  const handleDenseButtonClick = (event) => (anchorDense
    ? handleDenseButtonClick(event)
    : setAnchorDense(event.currentTarget))

  return (
    <div className={ styles.menuExampleContainer }>

      <Button
        aria-controls="menu-story-regular"
        aria-haspopup="true"
        onClick={ handleRegularButtonClick }
        className={ styles.microMargin }
      >
        Regular
      </Button>

      <Menu
        ariaLabelledby="menu-story-regular"
        controllingElementRef={ anchorRegular }
        isOpen={ !!anchorRegular }
        onClose={ handleRegularMenuClose }
      >
        <Menu.Item>Item #1</Menu.Item>
        <Menu.Item>Item #2</Menu.Item>
        <Menu.Item>Item #3</Menu.Item>
        <Menu.Item>Item #4</Menu.Item>
      </Menu>

      <Button
        aria-controls="menu-story-dense"
        aria-haspopup="true"
        onClick={ handleDenseButtonClick }
        className={ styles.microMargin }
      >
        Dense
      </Button>

      <Menu
        ariaLabelledby="menu-story-dense"
        controllingElementRef={ anchorDense }
        isOpen={ !!anchorDense }
        onClose={ handleDenseMenuClose }
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
