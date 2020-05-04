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
  attachDirection,
  usePortal,
  children,
  openDirection,
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
    attachDirection,
    openDirection,
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
  openDirection: 'auto',
  attachDirection: 'vertical',
}

Menu.propTypes = {
  /** Should the menu appear on screen or not. */
  isOpen: propTypes.bool,
  /** Determine the size of the menu's items. */
  variant: propTypes.oneOf(['regular', 'dense']),
  /** Reference to the controlling element,
   *  used to attached the to the menu to the controller which causes it to open. */
  controllingElementRef: propTypes.oneOfType([
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
  /** A callback triggered whenever the user is clicking outside the menu scope.
   * Usually should close the menu. */
  onClose: propTypes.func,
  /** Force the menu to open <b>to</b> a certain side.<br />
   * <code>up</code> - means that the menu will open <u>upwards</u><br />
   * <code>down</code> - means that the menu will open <u>downwards</u><br />
   * <code>start</code> - means that the menu will open
   * <u>towards the inline-start</u> of the document<br />
   * <code>end</code> - means that the menu will open
   * <u>towards the inline-end</u> of the document<br />
   * */
  openDirection: propTypes.oneOf([
    'auto',
    'up-start', 'up-end',
    'down-start', 'down-end',
  ]),
  /** Should the menu be wrapped with a portal */
  usePortal: propTypes.bool,
}

export default Menu
