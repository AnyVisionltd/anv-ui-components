import React from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import { ListItem } from './ListItem'
import styles from './List.module.scss'

const List = ({
  draggable,
  children,
  className,
  ...otherProps
}) => {
  const classes = classNames(
    styles.list,
    className
  )

  return (
    <ul
	  className={ classes }
	  { ...otherProps }
    >
	  {
	    children
	  }
    </ul>
  )
}

List.defaultProps = {

}

List.propTypes = {
  /** If true, list items are draggable. */
  draggable: propTypes.bool,
  /** For css customization. */
  className: propTypes.string
}

List.Item = ListItem
export default List