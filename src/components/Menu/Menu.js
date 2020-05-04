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
  onClose,
  className,
  controllingElementRef,
  snapToSide,
  usePortal,
  children,
  ...otherProps
}) => {
  const [isDisplayed, setDisplayed] = useState(false)
  const menuWrapperRef = useRef()
  useClickOutsideListener((event) => {
    const { target } = event
    if (!isDisplayed || target === controllingElementRef) {
      return
    }
    onClose(event)
  }, menuWrapperRef)
  const {
    styles: positionStyles = {},
    classNames: positionClassNames = {},
  } = useElementAbsolutePositioning(
    controllingElementRef,
    menuWrapperRef && menuWrapperRef.current,
    snapToSide,
    usePortal,
  )
  const containerClasses = classNames(
    styles.menuContainer,
    positionClassNames && styles[positionClassNames.vertical],
    positionClassNames && styles[positionClassNames.horizontal],
  )
  const menuClasses = classNames(
    styles.menu,
    styles[variant],
    className,
  )

  let animationVerticalStartingPoint = 'top'
  let animationHorizontalStartingPoint = 'start'
  switch (positionClassNames.vertical) {
    case 'fromAnchorElementTopUpwards':
    case 'fromAnchorElementBottomUpwards':
      animationVerticalStartingPoint = 'bottom'
      break
    default: animationHorizontalStartingPoint = 'top'
  }

  switch (positionClassNames.horizontal) {
    case 'fromAnchorElementEndToAnchorElementStart':
    case 'fromAnchorElementStart':
      animationHorizontalStartingPoint = 'end'
      break
    default: animationHorizontalStartingPoint = 'start'
  }

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
        onEnter={ () => setDisplayed(true) }
        onExited={ () => setDisplayed(false) }
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

  return usePortal
    ? renderMenuInPortal()
    : renderMenu()
}

Menu.defaultProps = {
  isOpen: false,
  variant: 'regular',
  onClose: () => {
  },
  usePortal: true,
}

Menu.propTypes = {
  /** Should the menu appear on screen or not. */
  isOpen: propTypes.bool,
  /** Determine the size of the menu's items. */
  variant: propTypes.oneOf(['regular', 'dense']),
  /** Reference to the controlling element,
   *  used to snap the to the element which causes it to open. */
  controllingElementRef: propTypes.oneOfType([
    propTypes.func,
    propTypes.shape({ current: propTypes.any }),
  ]),
  /** Determine whether the menu should snap to
   *  the controlling element from the sides, or top/bottom. */
  snapToSide: propTypes.bool,
  /** Add custom styling to the menu. */
  className: propTypes.string,
  /** Menu items (Menu.Item) or sub menus (Menu.SubMenu). */
  children: propTypes.node.isRequired,
  /** A callback triggered whenever the user is clicking outside the menu scope.
   * Usually should close the menu. */
  onClose: propTypes.func,
  /** Should the menu be wrapped with a portal */
  usePortal: propTypes.bool,
}

export default Menu
