import React, { useContext, useEffect } from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import { ReactComponent as SunIcon } from '../../../assets/svg/Check.svg'
import TableContext from '../TableContext'
import styles from './TableHeader.module.scss'

const sortOrderTypes = {
  ASC: 'asc',
  DESC: 'desc',
}

const TableHeader = ({
  headers,
  sortable,
  onHeaderCellClick,
  className,
  ...otherProps
}) => {
  const { state, setSort } = useContext(TableContext)
  const { sort: sortBy } = state

  useEffect(() => {
    setSort({ ...sortBy, sortable })
  }, [sortable, setSort, sortBy])

  console.log('header render')
  const renderSortingIcon = (field) => {
    const activeSort = sortBy && sortBy.field === field
    const activeSortOrder = activeSort && sortBy.order === sortOrderTypes.DESC
    const classes = classNames(
      styles.sortingIcon,
      activeSort && styles.activeSort,
      activeSortOrder && styles.sortingIconDesc,
    )
    return <SunIcon className={ classes } />
  }

  const sortColumn = (headerCell) => {
    const sortOrder = headerCell.field === sortBy.field && sortBy.order === sortOrderTypes.ASC
      ? sortOrderTypes.DESC
      : sortOrderTypes.ASC
    setSort({ ...sortBy, field: headerCell.field, order: sortOrder })
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

    const sortableColumn = sortBy.sortable && !disableSort
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
    <div
      role="row"
      className={ classes }
      { ...otherProps }
    >
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
  /** Is the table sortable */
  sortable: propTypes.bool,
  /** Callback fire when header cell click. */
  onHeaderCellClick: propTypes.func,
  /** For css customization. */
  className: propTypes.string,
}

export default TableHeader
