import React from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import { ReactComponent as SunIcon } from '../../../assets/svg/Sun.svg'
import styles from './TableHeader.module.scss'

const TableHeader = ({
  headers,
  isTableSortable,
  sortBy,
  onHeaderCellClick,
  className,
}) => {
  const renderSortingIcon = (field) => {
    const activeSort = sortBy && sortBy.field === field
    const classes = classNames(
      styles.sortingIcon,
      activeSort && styles.activeSort,
      sortBy.order === 'desc' && styles.sortingIconDesc,
    )
    return <SunIcon className={ classes } />
  }

  const sortColumn = (headerCell) => {
    onHeaderCellClick(headerCell)
  }

  const renderCell = (headerCell) => {
    const {
      field, content, disableSort, hide, size,
    } = headerCell
    if (hide) {
      return null
    }
    const style = size ? { flex: `0 1 ${size}` } : {}

    const sortableColumn = isTableSortable && !disableSort
    return (
      <div
        key={ field }
        role="cell"
        style={ style }
        className={ styles.tableHeaderCell }
        onClick={ () => sortableColumn && sortColumn(headerCell) }
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

  const classes = classNames(
    styles.tableHeader,
    className,
  )

  return (
    <div role="row" className={ classes }>
      { headers.map(renderCell) }
    </div>
  )
}

TableHeader.defaultProps = {
  onHeaderCellClick: () => {},
}

TableHeader.propTypes = {
  headers: propTypes.arrayOf(
    propTypes.shape({
      field: propTypes.string,
      displayName: propTypes.string,
      content: propTypes.oneOfType([
        propTypes.string,
        propTypes.func,
      ]),
      columnRender: propTypes.func,
      disableSort: propTypes.bool,
      customSort: propTypes.func,
      hide: propTypes.bool,
      size: propTypes.string,
      type: propTypes.oneOf(['string', 'number', 'date']),
    }),
  ).isRequired,
  /** Is table sortable */
  isTableSortable: propTypes.bool,
  /** Sorting field and order */
  sortBy: propTypes.shape({
    field: propTypes.string,
    order: propTypes.oneOf(['asc', 'desc']),
  }),
  /** Callback fire when header cell click. */
  onHeaderCellClick: propTypes.func,
  /** For css customization. */
  className: propTypes.string,
}

export default TableHeader
