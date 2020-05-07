import React from 'react'
import classNames from 'classnames'
import propTypes from 'prop-types'
import TableContext from './TableContext'
import UseTableReducer from './UseTableReducer'
import styles from './Table.module.scss'

const Table = ({
  children,
  className,
  ...otherProps
}) => {
  const [state, actions] = UseTableReducer()

  const classes = classNames(
    styles.table,
    className,
  )

  return (
    <TableContext.Provider value={ { state, ...actions } }>
      <div className={ classes } { ...otherProps }>
        { children }
      </div>
    </TableContext.Provider>
  )
}

Table.propTypes = {
  /** For css customization. */
  className: propTypes.string,
  /** Table components */
  children: propTypes.node,
}

export default Table
