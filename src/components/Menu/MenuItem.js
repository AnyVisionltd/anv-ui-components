import React from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import styles from './Menu.module.scss'

const MenuItem = ({
  className, children, onClick, ...otherProps
}) => {
  const classes = classNames(
    styles.menuItem,
    className,
  )

  const handleOnKeyDown = (event) => {
    if (event.key === 'Enter') {
      onClick(event)
    }
  }

  return (
    <li
      role="menuitem"
      tabIndex="0"
      className={ classes }
      onClick={ onClick }
      onKeyDown={ handleOnKeyDown }
      { ...otherProps }
    >
      <span className={ styles.menuItemLabel }>{ children }</span>
    </li>
  )
}

MenuItem.defaultProps = {
  onClick: () => {},
}

MenuItem.propTypes = {
  onClick: propTypes.func,
  className: propTypes.string,
  children: propTypes.node.isRequired,
}

export default MenuItem
