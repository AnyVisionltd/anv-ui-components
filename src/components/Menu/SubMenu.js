import React, { useState } from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import styles from './Menu.module.scss'
import { ReactComponent as ArrowIcon } from '../../assets/svg/Close.svg'
import Menu from './Menu'

const SubMenu = ({
  label, className, children, subMenuClassName, ...otherProps
}) => {
  const classes = classNames(
    styles.menuItem,
    className,
  )

  const subMenuClasses = classNames(
    styles.subMenu,
    subMenuClassName,
  )

  const [currentElement, setCurrentElement] = useState(null)

  const handleMouseOver = (event) => {
    setCurrentElement(event.currentTarget)
  }

  return (
    <li
      role="menuitem"
      tabIndex="0"
      className={ classes }
      onMouseOver={ handleMouseOver }
      onFocus={ handleMouseOver }
      { ...otherProps }
    >
      <span className={ styles.menuItemLabel }>{ label }</span>
      <span className={ styles.subMenuArrowIconContainer }>
        <ArrowIcon />
      </span>
      <Menu
        className={ subMenuClasses }
        opened={ !!currentElement }
        controllingElementRef={ currentElement }
        usePortal={ false }
        snapToSide
      >
        { children }
      </Menu>
    </li>
  )
}

SubMenu.propTypes = {
  className: propTypes.string,
  subMenuClassName: propTypes.string,
  label: propTypes.string,
  children: propTypes.node.isRequired,
}

export default SubMenu
