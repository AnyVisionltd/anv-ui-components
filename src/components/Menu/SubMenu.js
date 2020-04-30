import React, { useState } from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import styles from './Menu.module.scss'
import { ReactComponent as ArrowIcon } from '../../assets/svg/ArrowSolidRight.svg'
import Menu from './Menu'

const SubMenu = ({
  label, className, children, subMenuClassName, ...otherProps
}) => {
  const classes = classNames(
    styles.menuItem,
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
    setIsOpened(true)
    setCurrentElement(event.currentTarget)
  }
  const handleMouseOut = () => {
    setIsOpened(false)
  }

  // Disabled in order not to show "onMouseOut must be accompanied by onBlur for accessibility" -
  // Which actually harms the behaviour
  /* eslint-disable jsx-a11y/mouse-events-have-key-events */
  return (
    <li
      role="menuitem"
      tabIndex="0"
      className={ classes }
      onMouseOver={ handleMouseOver }
      onMouseOut={ handleMouseOut }
      onFocus={ handleMouseOver }
      { ...otherProps }
    >
      <span className={ styles.menuItemLabel }>{ label }</span>
      <span className={ styles.subMenuArrowIconContainer }>
        <ArrowIcon />
      </span>
      <Menu
        className={ subMenuClasses }
        opened={ isOpened }
        controllingElementRef={ currentElement }
        usePortal={ false }
        snapToSide
      >
        { children }
      </Menu>
    </li>
  )
  /* eslint-enable jsx-a11y/mouse-events-have-key-events */
}

SubMenu.propTypes = {
  className: propTypes.string,
  subMenuClassName: propTypes.string,
  label: propTypes.string,
  children: propTypes.node.isRequired,
}

export default SubMenu
