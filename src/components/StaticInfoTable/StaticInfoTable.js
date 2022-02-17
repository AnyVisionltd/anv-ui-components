import React from 'react'
import propTypes from 'prop-types'
import { StaticInfoTableHeader } from './StaticInfoTableHeader'
import { StaticInfoTableBody } from './StaticInfoTableBody'
import styles from './StaticInfoTable.module.scss'

const StaticInfoTable = ({ data, columns, isVirtualized, rowHeight }) => (
  <div className={styles.staticInfoTable}>
    <StaticInfoTableHeader columns={columns} />
    <StaticInfoTableBody
      data={data}
      columns={columns}
      isVirtualized={isVirtualized}
      rowHeight={rowHeight}
    />
  </div>
)

StaticInfoTable.defaultProps = {
  rowHeight: 44,
}

StaticInfoTable.propTypes = {
  /**
   *  Array of items, each item represent row in the table. <br/>
   *  <b>id</b><span style="color: #FF4400">*</span> field is required for each item. <br/>
   *  The rows rely on <code>columns</code>,
   *  <code>prop</code> from <code><Table.Header/></code> component.
   */
  data: propTypes.arrayOf(propTypes.object).isRequired,
  /** Table header fields. <br />
   *  <code>field</code>        		- match to the data properties. <br />
   *  <code>content</code>      		- what to render in the header cell.<br />
   *  <code>columnRender</code> 		- custom column render. <code>(cellData, rowData) => {}</code>. <br />
   *  <code>width</code>    			  - set the column width by flex basis. <br />
   *  <code>hide</code>         		- hide the column. <br />
   *  <code>className</code>        - custom style for the column. <br />
   **/
  columns: propTypes.arrayOf(
    propTypes.shape({
      field: propTypes.string.isRequired,
      content: propTypes.oneOfType([propTypes.string, propTypes.func])
        .isRequired,
      columnRender: propTypes.func,
      width: propTypes.string,
      hide: propTypes.bool,
      className: propTypes.string,
    }),
  ).isRequired,
  /** Whether the table needs to support virtualization. If using virtualized list, the rowHeight is constant. */
  isVirtualized: propTypes.bool,
  /** Height of a table row. Should be used if table is virtualized. */
  rowHeight: propTypes.number,
}

export default StaticInfoTable
