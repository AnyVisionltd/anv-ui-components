import React, { Children, cloneElement, isValidElement } from 'react'
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
    <div
	  className={ classes }
	  { ...otherProps }
    >
	  {
        Children.map(children, child => {
		  // Checking isValidElement is the safe way and avoids a TS error too.
		  if (isValidElement(child) && child.type === ListItem) {
            return cloneElement(child, { draggable })
		  }
		  return child
        })
	  }
    </div>
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