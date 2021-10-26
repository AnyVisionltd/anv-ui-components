import React, { useRef, useState } from 'react'
import { select } from '@storybook/addon-knobs'
import { centerDecorator } from '../../utils/storybook/decorators'
import { Menu, Button } from '../../index'
import { Switch } from '../Switch'
import styles from '../../storybook/index.module.scss'

export default {
  title: 'User Inputs/Menu',
  component: Menu,
  decorators: [centerDecorator],
  subcomponents: { Item: Menu.Item },
}

export const Default = () => {
  const [anchorElement, setAnchorElement] = useState(null)

  return (
    <div className={styles.menuExample}>
      <Button
        aria-controls='menu-story-default'
        aria-haspopup='true'
        ref={setAnchorElement}
      >
        Pizza Toppings
      </Button>

      <Menu aria-labelledby='menu-story-default' anchorElement={anchorElement}>
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
  const handleButtonClick = event =>
    anchorElement
      ? setAnchorElement(null)
      : setAnchorElement(event.currentTarget)

  return (
    <div className={styles.menuExample}>
      <Button
        style={{ position: 'absolute', top: 10, left: 10 }}
        aria-controls='menu-story'
        aria-haspopup='true'
        onClick={handleButtonClick}
      >
        Top, Left
      </Button>

      <Button
        style={{ position: 'absolute', top: 10, right: 10 }}
        aria-controls='menu-story'
        aria-haspopup='true'
        onClick={handleButtonClick}
      >
        Top, Right
      </Button>

      <Button
        style={{ position: 'absolute', bottom: 10, left: 10 }}
        aria-controls='menu-story'
        aria-haspopup='true'
        onClick={handleButtonClick}
      >
        Bottom, Left
      </Button>

      <Button
        style={{ position: 'absolute', bottom: 10, right: 10 }}
        aria-controls='menu-story'
        aria-haspopup='true'
        onClick={handleButtonClick}
      >
        Bottom, Right
      </Button>

      <div className={styles.tinyText}>Best viewed in canvas mode</div>

      <Menu
        aria-labelledby='menu-story'
        anchorElement={anchorElement}
        isOpen={!!anchorElement}
        onClose={handleClose}
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
  const handleButtonClick = () =>
    anchorElement ? setAnchorElement(null) : setAnchorElement(ref.current)

  const preferOpenDirection = select(
    'preferOpenDirection',
    [
      'top-start',
      'top',
      'top-end',
      'right-start',
      'right',
      'right-end',
      'bottom-start',
      'bottom',
      'bottom-end',
      'left-start',
      'left',
      'left-end',
    ],
    'bottom-start',
  )

  return (
    <div className={styles.menuExample}>
      <Button
        aria-controls='menu-story'
        aria-haspopup='true'
        onClick={handleButtonClick}
        ref={ref}
      >
        Open Menu
      </Button>

      <Menu
        aria-labelledby='menu-story'
        anchorElement={anchorElement}
        isOpen={!!anchorElement}
        onClose={handleClose}
        preferOpenDirection={preferOpenDirection}
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
  const handleButtonClick = () =>
    anchorElement ? setAnchorElement(null) : setAnchorElement(ref.current)

  return (
    <div className={styles.menuExample}>
      <Button
        aria-controls='menu-story-submenu'
        aria-haspopup='true'
        onClick={handleButtonClick}
        ref={ref}
      >
        Open Menu
      </Button>

      <Menu
        aria-labelledby='menu-story-submenu'
        anchorElement={anchorElement}
        isOpen={!!anchorElement}
        onClose={handleMenuClose}
      >
        <Menu.Item>List Item #1</Menu.Item>
        <Menu.Item>List Item #2</Menu.Item>
        <Menu.SubMenu label='Sub menu #1'>
          <Menu.Item>Item #1</Menu.Item>
          <Menu.Item>Item #2</Menu.Item>
          <Menu.SubMenu label='Sub menu #2'>
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

export const WithIsOpen = () => {
  const ref = useRef()
  const [anchorElement, setAnchorElement] = useState(null)
  const [isOpen, setIsOpen] = useState(false)

  const handleSwitchClick = () => {
    setIsOpen(!isOpen)
    if (!anchorElement) setAnchorElement(ref.current)
  }

  return (
    <div className={styles.menuExample}>
      <div className={styles.microMargin}>
        <Switch onClick={handleSwitchClick} checked={isOpen} />
      </div>
      <div className={styles.microMargin}>
        <Button
          aria-controls='menu-story-submenu'
          aria-haspopup='true'
          ref={ref}
        >
          Menu Anchor
        </Button>

        <Menu
          aria-labelledby='menu-story-submenu'
          anchorElement={anchorElement}
          isOpen={isOpen}
        >
          <Menu.Item>List Item #1</Menu.Item>
          <Menu.Item>List Item #2</Menu.Item>
          <Menu.SubMenu label='Sub menu #1'>
            <Menu.Item>Item #1</Menu.Item>
            <Menu.Item>Item #2</Menu.Item>
            <Menu.SubMenu label='Sub menu #2'>
              <Menu.Item>Item #1</Menu.Item>
              <Menu.Item>Item #2</Menu.Item>
              <Menu.Item>Item #3</Menu.Item>
              <Menu.Item>Item #4</Menu.Item>
            </Menu.SubMenu>
          </Menu.SubMenu>
          <Menu.Item>List Item #4</Menu.Item>
        </Menu>
      </div>
    </div>
  )
}

export const Variants = () => {
  const regularAnchorElement = useRef()
  const denseAnchorElement = useRef()

  const [regularAnchorElementOpened, setRegularAnchorElementOpened] = useState(
    null,
  )
  const [denseAnchorElementOpened, setDenseAnchorElementOpened] = useState(null)

  const openRegularMenu = () =>
    regularAnchorElementOpened
      ? setRegularAnchorElementOpened(null)
      : setRegularAnchorElementOpened(regularAnchorElement.current)
  const openDenseMenu = () =>
    denseAnchorElementOpened
      ? setDenseAnchorElementOpened(null)
      : setDenseAnchorElementOpened(denseAnchorElement.current)

  const closeRegularMenu = () => setRegularAnchorElementOpened(null)
  const closeDenseMenu = () => setDenseAnchorElementOpened(null)

  return (
    <div className={styles.menuExample}>
      <div className={styles.microMargin}>
        <Button
          aria-controls='menu-story-regular'
          aria-haspopup='true'
          onClick={openRegularMenu}
          ref={regularAnchorElement}
        >
          Regular
        </Button>
        <Menu
          aria-labelledby='menu-story-regular'
          anchorElement={regularAnchorElementOpened}
          isOpen={!!regularAnchorElementOpened}
          onClose={closeRegularMenu}
        >
          <Menu.Item>Item #1</Menu.Item>
          <Menu.Item>Item #2</Menu.Item>
          <Menu.Item>Item #3</Menu.Item>
          <Menu.Item>Item #4</Menu.Item>
        </Menu>
      </div>
      <div className={styles.microMargin}>
        <Button
          aria-controls='menu-story-dense'
          aria-haspopup='true'
          onClick={openDenseMenu}
          ref={denseAnchorElement}
        >
          Dense
        </Button>
        <Menu
          aria-labelledby='menu-story-dense'
          anchorElement={denseAnchorElementOpened}
          isOpen={!!denseAnchorElementOpened}
          onClose={closeDenseMenu}
          variant='dense'
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

export const Sizes = () => {
  const largeAnchorElement = useRef()
  const mediumAnchorElement = useRef()
  const smallAnchorElement = useRef()

  const [largeAnchorElementOpened, setLargeAnchorElementOpened] = useState(null)
  const [mediumAnchorElementOpened, setMediumAnchorElementOpened] = useState(
    null,
  )
  const [smallAnchorElementOpened, setSmallAnchorElementOpened] = useState(null)

  const openLargeMenu = () =>
    largeAnchorElementOpened
      ? setLargeAnchorElementOpened(null)
      : setLargeAnchorElementOpened(largeAnchorElement.current)
  const openMediumMenu = () =>
    mediumAnchorElementOpened
      ? setMediumAnchorElementOpened(null)
      : setMediumAnchorElementOpened(mediumAnchorElement.current)
  const openSmallMenu = () =>
    smallAnchorElementOpened
      ? setSmallAnchorElementOpened(null)
      : setSmallAnchorElementOpened(smallAnchorElement.current)

  const closeLargeMenu = () => setLargeAnchorElementOpened(null)
  const closeMediumMenu = () => setMediumAnchorElementOpened(null)
  const closeSmallMenu = () => setSmallAnchorElementOpened(null)

  const renderMenuItems = () =>
    Array.from({ length: 4 }, (_, index) => (
      <Menu.Item key={index}>Item #{index + 1}</Menu.Item>
    ))

  return (
    <div className={styles.menuExample}>
      <div className={styles.microMargin}>
        <Button
          aria-controls='menu-story-large'
          aria-haspopup='true'
          onClick={openLargeMenu}
          ref={largeAnchorElement}
        >
          Large
        </Button>
        <Menu
          aria-labelledby='menu-story-large'
          anchorElement={largeAnchorElementOpened}
          isOpen={!!largeAnchorElementOpened}
          onClose={closeLargeMenu}
        >
          {renderMenuItems()}
        </Menu>
      </div>
      <div className={styles.microMargin}>
        <Button
          aria-controls='menu-story-medium'
          aria-haspopup='true'
          onClick={openMediumMenu}
          ref={mediumAnchorElement}
        >
          Medium
        </Button>
        <Menu
          aria-labelledby='menu-story-medium'
          anchorElement={mediumAnchorElementOpened}
          isOpen={!!mediumAnchorElementOpened}
          onClose={closeMediumMenu}
          size='medium'
        >
          {renderMenuItems()}
        </Menu>
      </div>
      <div className={styles.microMargin}>
        <Button
          aria-controls='menu-story-small'
          aria-haspopup='true'
          onClick={openSmallMenu}
          ref={smallAnchorElement}
        >
          Small
        </Button>
        <Menu
          aria-labelledby='menu-story-small'
          anchorElement={smallAnchorElementOpened}
          isOpen={!!smallAnchorElementOpened}
          onClose={closeSmallMenu}
          size='small'
        >
          {renderMenuItems()}
        </Menu>
      </div>
    </div>
  )
}
