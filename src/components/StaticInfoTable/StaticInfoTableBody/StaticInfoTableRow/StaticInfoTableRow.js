import React from 'react'
import classNames from 'classnames'
import { Tooltip } from '../../../../index'
import styles from './StaticInfoTableRow.module.scss'

const StaticInfoTableRow = ({ row, columns, isVirtualized }) => {
  const renderCell = (row, field, columnRender) => {
    if (columnRender) return columnRender(row[field], row)
    return (
      <Tooltip overflowOnly content={row[field]}>
        <div>{row[field]}</div>
      </Tooltip>
    )
  }

  const renderDataRow = () => (
    <div
      role='row'
      className={classNames(styles.tableRow, { [styles.row]: !isVirtualized })}
    >
      {columns.map(({ field, columnRender, hide, className, width }) => {
        if (hide) return null

        const style = width ? { width: `${width}px` } : {}

        return (
          <div
            role='cell'
            className={classNames(styles.tableCell, className)}
            key={field}
            style={style}
          >
            {renderCell(row, field, columnRender)}
          </div>
        )
      })}
    </div>
  )

  return renderDataRow()
}

export default StaticInfoTableRow
