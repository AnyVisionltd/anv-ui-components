import React, {useRef} from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import styles from './Menu.module.scss'
import MenuItem from "./MenuItem"
import useClickOutsideListener from "../../hooks/ClickOutsideListener/ClickOutsideListener"
import {Portal} from "../Portal"
import {useWindowDimensions} from "../../hooks/WindowDimensions"
import {useElementAbsolutePositioning} from "../../hooks/ElementAbsolutePositioning"


/*
    TODO: Support positioning: bottomStart, bottomEnd, bottomCenter
                               topStart, topEnd, topCenter
                               auto
 */
const Menu = ({ opened, variant, onClickOutside, children, onClose, className, controllingElementRef, position }) => {
  console.log(controllingElementRef)
  const menuWrapperRef = useRef()
  console.log(opened)
  useClickOutsideListener(event => {
    const { target } = event
    if (target === controllingElementRef) {
      return
    }

    if (!onClickOutside && onClose) {
      onClose(event)
      return
    }

    onClickOutside()
  }, menuWrapperRef)
  const classes = classNames(
    styles.menu,
    styles[variant],
    !opened && styles.closed,
    opened && styles.opened,
    className,
  )

  const menuPositionStyles = useElementAbsolutePositioning(
    position,
    controllingElementRef,
    menuWrapperRef && menuWrapperRef.current
  )

  const getMenuStyles = () => {
    if (!controllingElementRef) {
      return null
    }

    return {
      position: 'absolute',
      ...menuPositionStyles
    }
  }

  const renderMenu = () => (
    <ul
      role="menu"
      className={ classes }
      ref={ menuWrapperRef }
      style={ getMenuStyles() }>
      { children }
    </ul>
  )

  return controllingElementRef
    ? (
      <Portal containerId="menu-portal">
        { renderMenu() }
      </Portal>
    )
    : renderMenu()
}

Menu.defaultProps = {
  opened: false,
  variant: 'regular',
  position: 'auto',
  onOpen: () => {},
  onClose: () => {},
  onOutsideClick: () => {},
}

Menu.propTypes = {
  opened: propTypes.bool,
  variant: propTypes.oneOf(['regular', 'dense']),
  position: propTypes.oneOf([
    'auto',
    'bottom', 'bottom-start', 'bottom-end',
    'top', 'top-start', 'top-end'
  ]),
  onOpen: propTypes.func,
  onClose: propTypes.func,
  onClickOutside: propTypes.func,
  className: propTypes.string
}

Menu.Item = MenuItem
export default Menu
