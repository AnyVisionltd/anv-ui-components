import React, { useRef, useState } from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import { useClickOutsideListener, useElementAbsolutePositioning } from '../../hooks'
import { Animations } from '../Animations'
import { Portal } from '../Portal'
import styles from './Menu.module.scss'

const Menu = ({
  isOpen,
  variant,
  className,
  anchorElement,
  attachDirection,
  children,
  openDirection,
  isSubMenu,
  onClose,
  onClosed,
  onOpened,
  ...otherProps
}) => {
  const [isDisplayed, setDisplayed] = useState(false)
  const menuWrapperRef = useRef()

  const {
    styles: positionStyles,
    openDirection: actualOpenDirection,
  } = useElementAbsolutePositioning(
    anchorElement,
    menuWrapperRef && menuWrapperRef.current,
    attachDirection,
    isDisplayed,
    openDirection,
    !isSubMenu,
  )

  useClickOutsideListener((event) => {
    const { target } = event
    if (!isOpen || target === anchorElement) {
      return
    }
    onClose(event)
  }, menuWrapperRef)

  const containerClasses = classNames(
    styles.menuContainer,
    actualOpenDirection && styles[actualOpenDirection.vertical],
    actualOpenDirection && styles[actualOpenDirection.horizontal],
    isSubMenu && styles.subMenu,
  )
  const menuClasses = classNames(
    styles.menu,
    styles[variant],
    className,
  )

  const handleMenuOpen = () => {
    setDisplayed(true)
    onOpened()
  }

  const handleMenuClose = () => {
    setDisplayed(false)
    onClosed()
  }

  // Scale animations direction props represent the start point,
  // whilst open direction means the opposite.
  // Therefore, we need to switch the directions
  const animationVerticalStartingPoint = actualOpenDirection && actualOpenDirection.vertical === 'up'
    ? 'bottom'
    : 'top'

  const animationHorizontalStartingPoint = actualOpenDirection && actualOpenDirection.horizontal === 'start'
    ? 'end'
    : 'start'

  const renderMenuList = () => (
    <ul
      role="menu"
      className={ menuClasses }
      ref={ menuWrapperRef }
      { ...otherProps }
    >
      { children }
    </ul>
  )

  const renderMenu = () => (
    <div
      className={ containerClasses }
      style={ positionStyles }
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
  onClose: () => {
  },
  onClosed: () => {
  },
  onOpened: () => {
  },
  isSubMenu: false,
  openDirection: 'auto',
  attachDirection: 'vertical',
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
  attachDirection: propTypes.oneOf(['vertical', 'horizontal']),
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
  openDirection: propTypes.oneOf([
    'auto',
    'up-start', 'up-end',
    'down-start', 'down-end',
  ]),
  /** <code>INTERNAL</code> Is the menu is in-fact a sub menu.
   * Is set internally by <code>Menu.SubMenu</code> */
  isSubMenu: propTypes.bool,
}

export default Menu
