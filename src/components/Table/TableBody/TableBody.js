import React, { useContext, useEffect } from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import TableContext from '../TableContext'
import styles from './TableBody.module.scss'

const TableBody = ({
  data,
  rowHeight,
  className,
  ...otherProps
}) => {
  const { state, setData } = useContext(TableContext)
  const { headers, data: contextData } = state

  useEffect(() => {
    setData(data)
  }, [setData, data])

  const classes = classNames(
    styles.tableBody,
    className,
  )

  const renderRow = row => (
    <>
      {/*{ renderCheckbox(row) }*/}
      { headers.map(({ field, columnRender, hide, flexWidth }) => {
        if (hide) {
          return null
        }
        const style = flexWidth ? { flex: `0 1 ${ flexWidth }` } : {}
        return (
          <div role={ 'cell' } style={ style } className={ styles.tableCell } key={ field }>
            { columnRender ? columnRender(row[field], row) : row[field] }
          </div>
        )
      }) }
      {/*{ renderDynamicColumnPlaceholder() }*/}
      {/*{ renderActions(row) }*/}
    </>
  )

  const renderTableRows = () => (
    contextData.map((row, index) => {
      const tableRowClassNames = classNames(styles.tableRow, { [styles.selectedRow]: false })
      return (
        <div
          role={ 'row' }
          style={ { height: rowHeight } }
          className={ tableRowClassNames } key={ index }
        >
          { renderRow(row) }
        </div>
      )
    })
  )

  return (
    <div
      className={ classes }
      { ...otherProps }
    >
      { renderTableRows() }
    </div>
  )
}

TableBody.defaultProps = {
  rowHeight: '56px'
}

TableBody.propTypes = {
  /**  Each object represent row in the table. The rows rely on <code>headers</code>, <code>prop</code> from <code><Table.Header/></code> component.*/
  data: propTypes.arrayOf('objects').isRequired,
  /** The row height. */
  rowHeight: propTypes.string
}

export default TableBody
