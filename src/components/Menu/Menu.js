import React, { useRef } from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import styles from './Menu.module.scss'
import useClickOutsideListener from '../../hooks/ClickOutsideListener/ClickOutsideListener'
import { Portal } from '../Portal'
import { useElementAbsolutePositioning } from '../../hooks/ElementAbsolutePositioning'

const Menu = ({
  opened, variant, onClickOutside, children, className,
  controllingElementRef, snapToSide,
}) => {
  const menuWrapperRef = useRef()
  useClickOutsideListener((event) => {
    const { target } = event
    if (target === controllingElementRef) {
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
    snapToSide,
    controllingElementRef,
    menuWrapperRef && menuWrapperRef.current,
  )

  const getMenuStyles = () => {
    if (!controllingElementRef) {
      return null
    }

    return {
      position: 'absolute',
      ...menuPositionStyles,
    }
  }

  const renderMenu = () => (
    <ul
      role="menu"
      className={ classes }
      ref={ menuWrapperRef }
      style={ getMenuStyles() }
    >
      { children }
    </ul>
  )

  return controllingElementRef
    ? (
      <Portal containerId="menu-portal" className={ styles.menuPortal }>
        { renderMenu() }
      </Portal>
    )
    : renderMenu()
}

Menu.defaultProps = {
  opened: false,
  variant: 'regular',
  onClickOutside: () => {},
}

Menu.propTypes = {
  opened: propTypes.bool,
  variant: propTypes.oneOf(['regular', 'dense']),
  snapToSide: propTypes.bool,
  onClickOutside: propTypes.func,
  className: propTypes.string,
  children: propTypes.node.isRequired,
  controllingElementRef: propTypes.shape({
    offsetLeft: propTypes.number,
    offsetRight: propTypes.number,
    offsetHeight: propTypes.number,
    offsetWidth: propTypes.number,
  }),
}

export default Menu
