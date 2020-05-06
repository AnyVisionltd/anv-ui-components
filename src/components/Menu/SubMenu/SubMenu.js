import React, { useRef, useState } from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import { ReactComponent as ArrowIcon } from '../../../assets/svg/ArrowSolidRight.svg'
import Menu from '../Menu'
import { MenuItem } from '../MenuItem'
import styles from './SubMenu.module.scss'

const SubMenu = ({
  label,
  disabled,
  className,
  children,
  subMenuClassName,
  ...otherProps
}) => {
  const ref = useRef()
  const classes = classNames(
    styles.subMenuItem,
    className,
  )
  const [isOpened, setIsOpened] = useState(false)

  const handleMouseEnter = () => {
    if (disabled) {
      return
    }
    setIsOpened(true)
  }
  const handleOnFocus = (event) => {
    handleMouseEnter(event)
  }
  const handleMouseLeave = () => {
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
      onMouseEnter={ handleMouseEnter }
      onMouseLeave={ handleMouseLeave }
      onFocus={ handleOnFocus }
      isSubMenu
      ref={ ref }
    >
      <span className={ styles.parentItemLabel }>{ label }</span>
      <ArrowIcon />
      <Menu
        className={ subMenuClassName }
        isOpen={ isOpened }
        anchorElement={ ref.current }
        attachDirection="horizontal"
        isSubMenu
        { ...otherProps }
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
