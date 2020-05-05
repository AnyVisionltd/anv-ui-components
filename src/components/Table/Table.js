import React from 'react'
import classNames from 'classnames'
import propTypes from 'prop-types'
import styles from './Table.module.scss'

const Table = ({ children, className, ...otherProps }) => {
  const classes = classNames(
    styles.table,
    className,
  )

  return (
    <div className={ classes } { ...otherProps }>
      { children }
    </div>
  )
}

Table.propTypes = {
  /** For css customization. */
  className: propTypes.string,
  children: propTypes.node,
}

export default Table
