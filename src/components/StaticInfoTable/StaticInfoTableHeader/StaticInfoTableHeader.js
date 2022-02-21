import React, { useContext, useEffect } from 'react'
import classNames from 'classnames'
import propTypes from 'prop-types'
import StaticInfoTableContext from '../StaticInfoTableContext'
import styles from './StaticInfoTableHeader.module.scss'

const StaticInfoTableHeader = ({ columns }) => {
  const { actions } = useContext(StaticInfoTableContext)

  useEffect(() => {
    actions.setColumns(columns)
  }, [actions, columns])

  const renderCell = ({ field, content, hide, className, width }) => {
    if (hide) return null

    const style = width ? { width: `${width}px` } : {}

    return (
      <div
        key={field}
        role='cell'
        className={classNames(styles.headerCell, className)}
        style={style}
      >
        {typeof content === 'function' ? content(field) : content}
      </div>
    )
  }

  return (
    <div className={styles.staticInfoTableHeader}>
      {columns.map(renderCell)}
    </div>
  )
}

StaticInfoTableHeader.propTypes = {
  /** Table header fields. <br />
   *  <code>field</code>        		- match to the data properties. <br />
   *  <code>content</code>      		- what to render in the header cell.<br />
   *  <code>columnRender</code> 		- custom column render. <code>(cellData, rowData) => {}</code>. <br />
   *  <code>columnBottomRender</code>- custom render for the bottom of the table. Necessary when call to action is needed.<code>() => {}</code>. <br />
   *  <code>width</code>    			  - set the column width by flex basis. <br />
   *  <code>hide</code>         		- hide the column. <br />
   *  <code>className</code>        - custom style for the column. <br />
   *  <code>renderTableBottom</code>- custom render for table bottom for each column. <br />
   **/
  columns: propTypes.arrayOf(
    propTypes.shape({
      field: propTypes.string.isRequired,
      content: propTypes.oneOfType([propTypes.string, propTypes.func])
        .isRequired,
      columnRender: propTypes.func,
      columnBottomRender: propTypes.func,
      width: propTypes.string,
      hide: propTypes.bool,
      className: propTypes.string,
      renderTableBottom: propTypes.func,
    }),
  ).isRequired,
}

export default StaticInfoTableHeader
