import React, { useRef } from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import styles from './Menu.module.scss'
import { useClickOutsideListener } from '../../hooks/ClickOutsideListener'
import useElementAbsolutePositioning from './ElementAbsolutePositioning'
import { Portal } from '../Portal'

const Menu = ({
  opened, variant, onClickOutside, children, className,
  controllingElementRef, snapToSide, usePortal,
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

  return controllingElementRef && usePortal
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
  onClickOutside: () => {
  },
  usePortal: true,
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
  usePortal: propTypes.bool,
}

export default Menu
