import React from 'react'
import classNames from 'classnames'
import { StaticInfoTableList } from './StaticInfoTableList'
import { StaticInfoTableRow } from './StaticInfoTableRow'
import styles from './StaticInfoTableBody.module.scss'

const StaticInfoTableBody = ({ data, columns, isVirtualized, rowHeight }) => {
  const renderRow = (row, index) => (
    <StaticInfoTableRow
      key={index}
      row={row}
      columns={columns}
      isVirtualized={isVirtualized}
    />
  )

  const classes = classNames(styles.staticInfoTableBody, {
    [styles.tableList]: !isVirtualized,
  })

  return (
    <div className={classes}>
      {isVirtualized ? (
        <StaticInfoTableList
          data={data}
          renderRow={renderRow}
          rowHeight={rowHeight}
        />
      ) : (
        data.map(renderRow)
      )}
    </div>
  )
}

export default StaticInfoTableBody
