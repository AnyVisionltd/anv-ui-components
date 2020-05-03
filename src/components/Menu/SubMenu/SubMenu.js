import React, { useState } from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import { ReactComponent as ArrowIcon } from '../../../assets/svg/ArrowSolidRight.svg'
import Menu from '../Menu'
import { MenuItem } from '../MenuItem'
import styles from './SubMenu.module.scss'

const SubMenu = ({
  label, disabled, className, children, subMenuClassName, ...otherProps
}) => {
  const classes = classNames(
    styles.subMenuItem,
    className,
  )
  const subMenuClasses = classNames(
    styles.subMenu,
    subMenuClassName,
  )
  const [isOpened, setIsOpened] = useState(false)
  const [currentElement, setCurrentElement] = useState(null)

  const handleMouseOver = (event) => {
    if (disabled) {
      return
    }
    setIsOpened(true)
    setCurrentElement(event.currentTarget)
  }
  const handleOnFocus = (event) => {
    handleMouseOver(event)
  }
  const handleMouseOut = () => {
    if (disabled) {
      return
    }
    setIsOpened(false)
  }

  // Disabled in order not to show "onMouseOut must be accompanied by onBlur for accessibility" -
  // Which actually harms the behaviour
  /* eslint-disable jsx-a11y/mouse-events-have-key-events */
  return (
    <MenuItem
      className={ classes }
      onMouseOver={ handleMouseOver }
      onMouseOut={ handleMouseOut }
      onFocus={ handleOnFocus }
      { ...otherProps }
    >
      <span className={ styles.parentItemLabel }>{ label }</span>
      <ArrowIcon />
      <Menu
        className={ subMenuClasses }
        isOpen={ isOpened }
        controllingElementRef={ currentElement }
        snapToSide
      >
        { children }
      </Menu>
    </MenuItem>
  )
  /* eslint-enable jsx-a11y/mouse-events-have-key-events */
}

SubMenu.defaultProps = {
  disabled: false,
}

SubMenu.propTypes = {
  /** The sub menu's item label. */
  label: propTypes.string,
  /** Attach custom styling to the sub menu's list item. */
  className: propTypes.string,
  /** Attach custom styling to the sub menu. */
  subMenuClassName: propTypes.string,
  /** Menu items (Menu.Item) for the sub menu, or more nested sub menus (Menu.SubMenu). */
  children: propTypes.node.isRequired,
  /** Should the sub menu item be disabled. */
  disabled: propTypes.bool,
}

export default SubMenu
