import React, { useState } from 'react'
import Menu from '.'
import { centerDecorator } from '../../utils/storybook/decorators'
import { Button } from '../Button'
import styles from '../../styles/storybook/index.module.scss'

export default {
  title: 'Components/Menu',
  component: Menu,
  decorators: [centerDecorator],
}

export const Default = () => {
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleClick = (event) => (anchorEl
    ? handleClose(event)
    : setAnchorEl(event.currentTarget))

  return (
    <div className={ styles.menuExampleContainer }>
      <Button
        aria-controls="menu-story"
        aria-haspopup="true"
        onClick={ handleClick }
      >
        Open Menu
      </Button>
      <Menu
        ariaLabelledby="menu-story"
        controllingElementRef={ anchorEl }
        opened={ !!anchorEl }
        onClickOutside={ handleClose }
      >
        <Menu.Item>List Item #1</Menu.Item>
        <Menu.Item>List Item #2</Menu.Item>
        <Menu.SubMenu label="Sub Menu">
          <Menu.Item>Sub Menu Item #1</Menu.Item>
          <Menu.Item>Sub Menu Item #2</Menu.Item>
          <Menu.Item>Sub Menu Item #3</Menu.Item>
        </Menu.SubMenu>
        <Menu.Item>List Item #4</Menu.Item>
      </Menu>
    </div>
  )
}

export const AutomaticOpeningPosition = () => {
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
        opened={ !!anchorEl }
        onClickOutside={ handleClose }
      >
        <Menu.Item>List Item #1</Menu.Item>
        <Menu.Item>List Item #2</Menu.Item>
        <Menu.Item>List Item #4</Menu.Item>
        <Menu.Item>List Item #4</Menu.Item>
      </Menu>
    </div>
  )
}
