import React, { forwardRef } from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import styles from './ListItem.module.scss'

const ListItem = forwardRef(({
  leadingComponent,
  trailingComponent,
  children,
  className,
  ...otherProps
}, ref) => {
  const classes = classNames(
    styles.listItem,
    className
  )

  return (
    <li
      { ...otherProps }
      ref={ ref }
	    className={ classes }
    >
	  <div>{ leadingComponent }</div>
	  <div className={ styles.content }> { children } </div>
	  <div>{ trailingComponent }</div>
    </li>
  )
})

ListItem.defaultProps = {}

ListItem.propTypes = {
  /** Component before the children. */
  leadingComponent: propTypes.node,
  /** Component after the children. */
  trailingComponent: propTypes.node,
  /** For css customization. */
  className: propTypes.string
}

export default ListItem
