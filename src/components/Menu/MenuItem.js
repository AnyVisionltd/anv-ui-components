import React from 'react'
import classNames from "classnames"
import styles from "./Menu.module.scss"

const MenuItem = ({ className, children, onClick }) => {
  const classes = classNames(
    styles.menuItem,
    className
  )

  return (
    <li role="menuitem" tabIndex="0" className={ classes } onClick={ onClick }>
      { children }
    </li>
  )
}

MenuItem.defaultProps = {
}

MenuItem.propTypes = {
}

export default MenuItem
