import React, { forwardRef } from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import { ListItem } from './ListItem'
import styles from './List.module.scss'

const List = forwardRef(
  ({ draggable, children, className, ...otherProps }, ref) => {
    const classes = classNames(styles.list, className)

    return (
      <ul {...otherProps} ref={ref} className={classes}>
        {children}
      </ul>
    )
  },
)

List.defaultProps = {}

List.propTypes = {
  /** For css customization. */
  className: propTypes.string,
}

List.Item = ListItem
export default List
