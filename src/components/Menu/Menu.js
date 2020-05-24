import React, { useCallback, useEffect, useRef, useState } from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import keymap from "../../utils/enums/keymap"
import { useClickOutsideListener, usePopoverPositioning } from '../../hooks'
import { Animations } from '../Animations'
import { Portal } from '../Portal'
import styles from './Menu.module.scss'

const Menu = ({
  isOpen,
  variant,
  className,
  anchorElement,
  attachAxis,
  children,
  preferOpenDirection,
  isSubMenu,
  onClose,
  onClosed,
  onOpened,
  ...otherProps
}) => {
  const [menuAnchor, setMenuAnchor] = useState(false)
  const [currentFocus, setCurrentFocus] = useState(false)

  const menuWrapperRef = useRef()

  const popoverDirection = usePopoverPositioning(
    anchorElement,
    menuWrapperRef && menuWrapperRef.current,
    attachAxis,
    menuAnchor,
    preferOpenDirection,
    !isSubMenu,
  )

  useClickOutsideListener(event => {
    if (!isOpen || event.target === anchorElement) {
      return
    }
    onClose(event)
  }, menuWrapperRef)

  const handleKeyDown = useCallback(event => {
    const nextFocus = (nextFocusDirection, firstFocus) => {
      if(!currentFocus) {
        const focusItem = menuWrapperRef.current.firstChild[firstFocus]
        focusItem.focus()
        setCurrentFocus(focusItem)
      }
      else if(!currentFocus[nextFocusDirection]) {
        anchorElement.focus()
        setCurrentFocus(null)
      }
      else if (currentFocus[nextFocusDirection]) {
        const focusItem = currentFocus[nextFocusDirection]
        focusItem.focus()
        setCurrentFocus(focusItem)
      }
    }

    switch (event.keyCode) {
      case keymap.ARROW_DOWN:
        nextFocus('nextElementSibling', 'firstChild')
        break
      case keymap.ARROW_UP:
        nextFocus('previousElementSibling', 'lastChild')
        break
      case keymap.ESCAPE:
        onClose()
        break
      default:
        break
    }
  }, [currentFocus, anchorElement, onClose])

  useEffect(() => {
    if(isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    } else {
      setCurrentFocus(null)
      document.removeEventListener('keydown', handleKeyDown)
    }
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, handleKeyDown])

  const handleMenuOpen = () => {
    setMenuAnchor(true)
    onOpened()
  }

  const handleMenuClose = () => {
    setMenuAnchor(false)
    onClosed()
  }

  // Scale animations direction props represent the start point,
  // whilst open direction means the opposite.
  // Therefore, we need to switch the directions
  const animationVerticalStartingPoint = popoverDirection && popoverDirection.vertical === 'up'
    ? 'bottom'
    : 'top'

  const animationHorizontalStartingPoint = popoverDirection && popoverDirection.horizontal === 'start'
    ? 'end'
    : 'start'

  const renderMenuList = () => (
    <ul
      role="menu"
      className={ menuClasses }
      { ...otherProps }
    >
      { children }
    </ul>
  )

  const containerClasses = classNames(
    styles.menuContainer,
    popoverDirection && styles[popoverDirection.vertical],
    popoverDirection && styles[popoverDirection.horizontal],
    isSubMenu && styles.subMenu,
  )
  const menuClasses = classNames(
    styles.menu,
    styles[variant],
    className,
  )

  const renderMenu = () => (
    <div
      ref={ menuWrapperRef }
      className={ containerClasses }
    >
      <Animations.Scale
        isOpen={ isOpen }
        onEnter={ () => handleMenuOpen() }
        onExited={ () => handleMenuClose() }
        verticalStart={ animationVerticalStartingPoint }
        horizontalStart={ animationHorizontalStartingPoint }
      >
        { renderMenuList() }
      </Animations.Scale>
    </div>
  )

  const renderMenuInPortal = () => (
    <Portal containerId="menu-container">
      { renderMenu() }
    </Portal>
  )

  return !isSubMenu
    ? renderMenuInPortal()
    : renderMenu()
}

Menu.defaultProps = {
  isOpen: false,
  variant: 'regular',
  onClose: () => {},
  onClosed: () => {},
  onOpened: () => {},
  isSubMenu: false,
  preferOpenDirection: 'down-end',
  attachAxis: 'vertical',
}

Menu.propTypes = {
  /** Should the menu appear on screen or not. */
  isOpen: propTypes.bool.isRequired,
  /** Determine the size of the menu's items. */
  variant: propTypes.oneOf(['regular', 'dense']),
  /** Reference to the controlling element,
   *  used to attached the to the menu to the controller which causes it to open. */
  anchorElement: propTypes.oneOfType([
    propTypes.func,
    propTypes.shape({ current: propTypes.any }),
  ]),
  /** Determine whether the menu should be attached to
   *  the controlling element from the side, or top/bottom. */
  attachAxis: propTypes.oneOf(['vertical', 'horizontal']),
  /** Add custom styling to the menu. */
  className: propTypes.string,
  /** Menu items (Menu.Item) or sub menus (Menu.SubMenu). */
  children: propTypes.node.isRequired,
  /** A callback triggered whenever the user is clicking outside the menu scope. */
  onClose: propTypes.func,
  /** A callback triggered after the menu is opened. */
  onOpened: propTypes.func,
  /** A callback triggered after the menu is closed. */
  onClosed: propTypes.func,
  /** Force the menu to open <b>to</b> a certain side.<br />
   * <code>up</code> - means that the menu will open <u>upwards</u><br />
   * <code>down</code> - means that the menu will open <u>downwards</u><br />
   * <code>start</code> - means that the menu will open
   * <u>towards the inline-start</u> of the document<br />
   * <code>end</code> - means that the menu will open
   * <u>towards the inline-end</u> of the document
   * */
  preferOpenDirection: propTypes.oneOf([
    'up-start', 'up-end',
    'down-start', 'down-end',
  ]),
  /** <code>INTERNAL</code> Is the menu is in-fact a sub menu.
   * Is set internally by <code>Menu.SubMenu</code> */
  isSubMenu: propTypes.bool,
}

export default Menu
