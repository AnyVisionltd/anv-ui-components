import React, { useRef } from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import { useClickOutsideListener } from '../../hooks/ClickOutsideListener'
import useElementAbsolutePositioning from './UseElementAbsolutePositioning'
import styles from './Menu.module.scss'

const Menu = ({
  isOpen, variant, onClose, children, className,
  controllingElementRef, snapToSide,
}) => {
  const menuWrapperRef = useRef()
  useClickOutsideListener((event) => {
    const { target } = event
    if (!isOpen || target === controllingElementRef) {
      return
    }
    onClose(event)
  }, menuWrapperRef)
  const { styles: positionStyles, classNames: positionClassNames } = useElementAbsolutePositioning(
    snapToSide,
    controllingElementRef,
    menuWrapperRef && menuWrapperRef.current,
  )
  const classes = classNames(
    styles.menu,
    styles[variant],
    !isOpen && styles.closed,
    isOpen && styles.opened,
    positionClassNames && styles[positionClassNames.vertical],
    positionClassNames && styles[positionClassNames.horizontal],
    className,
  )

  const getMenuStyles = () => {
    if (!controllingElementRef) {
      return null
    }

    return {
      position: 'absolute',
      ...positionStyles,
    }
  }

  return (
    <ul
      role="menu"
      className={ classes }
      ref={ menuWrapperRef }
      style={ getMenuStyles() }
    >
      { children }
    </ul>
  )
}

Menu.defaultProps = {
  isOpen: false,
  variant: 'regular',
  onClose: () => {},
}

Menu.propTypes = {
  /** Should the menu appear on screen or not. */
  isOpen: propTypes.bool,
  /** Determine the size of the menu's items. */
  variant: propTypes.oneOf(['regular', 'dense']),
  /** Reference to the controlling element,
   *  used to snap the to the element which causes it to open. */
  controllingElementRef: propTypes.shape({
    offsetLeft: propTypes.number,
    offsetRight: propTypes.number,
    offsetHeight: propTypes.number,
    offsetWidth: propTypes.number,
  }),
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
}

export default Menu
