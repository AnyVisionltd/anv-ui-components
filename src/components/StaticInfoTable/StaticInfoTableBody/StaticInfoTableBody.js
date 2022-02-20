import React, { useContext } from 'react'
import classNames from 'classnames'
import propTypes from 'prop-types'
import { StaticInfoTableList } from './StaticInfoTableList'
import { StaticInfoTableRow } from './StaticInfoTableRow'
import StaticInfoTableContext from '../StaticInfoTableContext'
import styles from './StaticInfoTableBody.module.scss'

const StaticInfoTableBody = ({ data, isVirtualized, rowHeight }) => {
  const {
    state: { columns },
  } = useContext(StaticInfoTableContext)

  const renderRow = (row, index, isBottomRow) => (
    <StaticInfoTableRow
      key={index}
      row={row}
      columns={columns}
      isVirtualized={isVirtualized}
      isBottomRow={isBottomRow}
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

StaticInfoTableBody.defaultProps = {
  rowHeight: 44,
}

StaticInfoTableBody.propTypes = {
  /**
   *  Array of items, each item represent row in the table. <br/>
   *  The rows rely on <code>columns</code>,
   *  <code>prop</code> from <code><StaticInfoTable.Header/></code> component.
   */
  data: propTypes.arrayOf(propTypes.object).isRequired,
  /** Whether the table needs to support virtualization. If using virtualized list, the rowHeight is constant. */
  isVirtualized: propTypes.bool,
  /** Height of a table row. Should be used if table is virtualized. */
  rowHeight: propTypes.number,
}

export default StaticInfoTableBody
