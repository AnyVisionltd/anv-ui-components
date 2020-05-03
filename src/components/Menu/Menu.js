import React, { useRef } from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import styles from './Menu.module.scss'
import { useClickOutsideListener } from '../../hooks/ClickOutsideListener'
import useElementAbsolutePositioning from './ElementAbsolutePositioning'

const Menu = ({
  opened, variant, onClickOutside, children, className,
  controllingElementRef, snapToSide,
}) => {
  const menuWrapperRef = useRef()
  useClickOutsideListener((event) => {
    const { target } = event
    if (!opened || target === controllingElementRef) {
      return
    }
    onClickOutside(event)
  }, menuWrapperRef)
  const { styles: positionStyles, classNames: positionClassNames } = useElementAbsolutePositioning(
    snapToSide,
    controllingElementRef,
    menuWrapperRef && menuWrapperRef.current,
  )
  const classes = classNames(
    styles.menu,
    styles[variant],
    !opened && styles.closed,
    opened && styles.opened,
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
  opened: false,
  variant: 'regular',
  onClickOutside: () => {}
}

Menu.propTypes = {
  /** Should the menu appear on screen or not. */
  opened: propTypes.bool,
  /** Determine the size of the menu's items. */
  variant: propTypes.oneOf(['regular', 'dense']),
  /** Reference to the controlling element, used to snap the to the element which causes it to open. */
  controllingElementRef: propTypes.shape({
    offsetLeft: propTypes.number,
    offsetRight: propTypes.number,
    offsetHeight: propTypes.number,
    offsetWidth: propTypes.number,
  }),
  /** Determine whether the menu should snap to the controlling element from the sides, or top/bottom. */
  snapToSide: propTypes.bool,
  /** Add custom styling to the menu. */
  className: propTypes.string,
  /** Menu items (Menu.Item) or sub menus (Menu.SubMenu). */
  children: propTypes.node.isRequired,
  /** A callback triggered whenever the user is clicking outside the menu scope.
   * Usually should close the menu. */
  onClickOutside: propTypes.func
}

export default Menu
