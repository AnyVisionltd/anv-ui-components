import React, { useEffect } from 'react'
import classNames from 'classnames'
import propTypes from 'prop-types'
import TableContext from './TableContext'
import { TableBody } from './TableBody'
import { TableHeader } from './TableHeader'
import { Sortable } from './Sortable'
import { TableSSF } from './TableSSF'
import { Selection } from './Selection'
import { ColumnManagement } from './ColumnManagement'
import UseTableReducer from './UseTableReducer'
import styles from './Table.module.scss'

const Table = ({
  selfControlled,
  onChange,
  children,
  className,
  ...otherProps
}) => {
  const [state, actions] = UseTableReducer()
  const { setSelfControlled } = actions

  const { filters, sort } = state
  const { sortBy } = sort

  useEffect(() => {
    setSelfControlled(selfControlled)
  }, [selfControlled, setSelfControlled])

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = {
        filters,
        sort: sortBy
      }
      onChange(params)
    }, 100)
    return () => {
      clearTimeout(timer)
    }
  }, [filters, sortBy, onChange])

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

Table.defaultProps = {
  selfControlled: false,
  onChange: () => {}
}

Table.propTypes = {
  /** If true, SSF, Sort, etc.. controlled by the table component */
  selfControlled: propTypes.bool,
  /** Fire on filters, sort changed */
  onChange: propTypes.func,
  /** For css customization. */
  className: propTypes.string,
  /** Table components */
  children: propTypes.node,
}

Table.Body = TableBody
Table.Header = TableHeader
Table.Sortable = Sortable
Table.SSF = TableSSF
Table.Selection = Selection
Table.ColumnManagement = ColumnManagement

export default Table
