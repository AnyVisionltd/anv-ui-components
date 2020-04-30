import React, {useState} from "react"
import Menu from "./Menu"
import {centerDecorator} from "../../utils/storybook/decorators"
import {Button} from "../Button"

export default {
  title: 'Menu',
  component: Menu,
  decorators: [centerDecorator],
}

export const Default = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    if (anchorEl) {
      return handleClose(event)
    }
    setAnchorEl(event.currentTarget)
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button aria-controls="menu-story" aria-haspopup="true" onClick={handleClick} style={{ marginTop: '300px' }}>
        Open menu
      </Button>
      <Menu
        ariaLabelledby="menu-story"
        controllingElementRef={anchorEl}
        opened={!!anchorEl}
        onClose={handleClose}
        position='top-end'
      >
        <Menu.Item>List Item #1</Menu.Item>
        <Menu.Item>List Item #2</Menu.Item>
        <Menu.Item>List Item #4</Menu.Item>
        <Menu.Item>List Item #4</Menu.Item>
      </Menu>
    </>
  )
}