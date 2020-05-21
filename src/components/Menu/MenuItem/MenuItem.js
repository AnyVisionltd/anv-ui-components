import React, { forwardRef } from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import styles from './MenuItem.module.scss'

const MenuItem = forwardRef(({
  className,
  onClick,
  disabled,
  isSubMenu,
  children,
  ...otherProps
}, ref) => {
  const classes = classNames(
    styles.menuItem,
    isSubMenu && styles.subMenuItem,
    className,
  )

  const handleOnClick = event => {
    if (disabled) {
      return
    }
    onClick(event)
  }

  const handleOnKeyDown = event => {
    if (event.key === 'Enter') {
      handleOnClick(event)
    }
  }

  // Disabled since the element is non-interactive only when disabled flag passed, which also makes
  // the callback handlers non-interactive
  /* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
  return (
    <li
      role={ !disabled ? 'menuitem' : undefined }
      tabIndex={ !disabled ? '0' : undefined }
      className={ classes }
      onClick={ !disabled && handleOnClick }
      onKeyDown={ !disabled && handleOnKeyDown }
      ref={ ref }
      { ...otherProps }
    >
      { children }
    </li>
  )
  /* eslint-enable jsx-a11y/no-noninteractive-element-interactions */
})

MenuItem.defaultProps = {
  disabled: false,
  isSubMenu: false,
  onClick: () => {},
}

MenuItem.propTypes = {
  /** Is the item menu disabled. */
  disabled: propTypes.bool,
  /** A callback triggered whenever the user is clicking on the item. */
  onClick: propTypes.func,
  /** Add custom styling to the menu item. */
  className: propTypes.string,
  /** Menu item label (or any other elements attached to the label). */
  children: propTypes.node.isRequired,
  /** <code>INTERNAL</code> If the element is sub menu type,
   * should usually only used by the Menu component. */
  isSubMenu: propTypes.bool,
}

export default MenuItem
