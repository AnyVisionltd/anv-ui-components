import React, { useContext, useEffect } from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import { ReactComponent as LongArrow } from '../../../assets/svg/LongArrow.svg'
import TableContext from '../TableContext'
import styles from './TableHeader.module.scss'

const sortOrderTypes = {
  ASC: 'asc',
  DESC: 'desc',
}

const TableHeader = ({
  headers,
  onHeaderCellClick,
  className,
  ...otherProps
}) => {
  const { state, setSortBy, setHeaders } = useContext(TableContext)
  const { headers: contextHeaders, sort, withRowActions } = state
  const { sortBy, sortable } = sort

  useEffect(() => {
    setHeaders(headers)
  }, [setHeaders, headers])

  const renderSortingIcon = field => {
    const activeSort = sortBy && sortBy.field === field
    const activeSortOrder = activeSort && sortBy.order === sortOrderTypes.DESC
    const classes = classNames(
      styles.sortingIcon,
      activeSort && styles.activeSort,
      activeSortOrder && styles.sortingIconDesc,
    )
    return <LongArrow className={ classes } />
  }

  const sortColumn = headerCell => {
    const sortOrder = headerCell.field === sortBy.field && sortBy.order === sortOrderTypes.ASC
      ? sortOrderTypes.DESC
      : sortOrderTypes.ASC
    setSortBy({ field: headerCell.field, order: sortOrder })
  }

  const handleHeaderCellClick = (headerCell, sortableColumn) => {
    onHeaderCellClick(headerCell)
    sortableColumn && sortColumn(headerCell)
  }

  const renderCell = headerCell => {
    const {
      field, content, disableSort, hide, flexWidth,
    } = headerCell
    if (hide) {
      return null
    }
    const style = flexWidth ? { flex: `0 0 ${flexWidth}` } : {}

    const sortableColumn = sortable && !disableSort
    const tableCellClass = classNames(
      styles.tableHeaderCell,
      { [styles.sortableColumn]: sortableColumn },
    )
    return (
      <div
        key={ field }
        role="cell"
        style={ style }
        className={ tableCellClass }
        onClick={ () => handleHeaderCellClick(headerCell, sortableColumn) }
      >
        {
          typeof content === 'function'
            ? content()
            : content
        }
        {
          sortableColumn && renderSortingIcon(field)
        }
      </div>
    )
  }

  const renderActionsPlaceholder = () => (
    withRowActions && <div className={ styles.actionsPlaceholder } />
  )

  const classes = classNames(
    styles.tableHeader,
    className,
  )

  return (
    <div
      role="row"
      className={ classes }
      { ...otherProps }
    >
      { contextHeaders.map(renderCell) }
      { renderActionsPlaceholder() }
    </div>
  )
}

TableHeader.defaultProps = {
  onHeaderCellClick: () => {},
}

TableHeader.propTypes = {
  /** Table header fields. <br />
   *  <code>field</code>        - match to the data properties. <br />
   *  <code>content</code>      - what to render in the header cell.<br />
   *  <code>label</code>        - display name to render on SSF and Column Management. <br />
   *  <code>type</code>         - column type, use by SSF and controlled sort. <br />
   *  <code>columnRender</code> - function for custom column render. <br />
   *  <code>disableSort</code>  - disable sort for the column. <br />
   *  <code>hide</code>         - hide the column. <br />
   *  <code>flexWidth</code>    - set the column width by flex basis. <br />
   **/
  headers: propTypes.arrayOf(
    propTypes.shape({
      field: propTypes.string.isRequired,
      content: propTypes.oneOfType([
        propTypes.string,
        propTypes.func,
      ]).isRequired,
      label: propTypes.string,
      type: propTypes.oneOf(['string', 'number', 'date']),
      columnRender: propTypes.func,
      disableSort: propTypes.bool,
      hide: propTypes.bool,
      flexWidth: propTypes.string,
    }),
  ).isRequired,
  /** Callback fire when header cell click with cell field. */
  onHeaderCellClick: propTypes.func,
  /** For css customization. */
  className: propTypes.string,
}

export default TableHeader
