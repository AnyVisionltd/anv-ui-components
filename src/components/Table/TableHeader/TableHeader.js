import React, { useContext, useEffect } from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import { getCellWidth } from '../utlis'
import languageService from '../../../services/language'
import { orderTypes } from '../../../utils/enums/common'
import { ReactComponent as LongArrowIcon } from '../../../assets/svg/LongArrow.svg'
import { ReactComponent as ManageColumnIcon } from '../../../assets/svg/ManageColumn.svg'
import TableContext from '../TableContext'
import { Checkbox, IconButton } from '../../../index'
import styles from './TableHeader.module.scss'
import { useTableData } from '../UseTableData'

const getTranslation = path => languageService.getTranslation(`${path}`)

const TableHeader = ({
  columns,
  onHeaderCellClick,
  className,
  ...otherProps
}) => {
  const {
    state,
    setSortBy,
    setColumns,
    toggleSelectAll,
    setColumnManagementIsOpen,
  } = useContext(TableContext)
  const {
    columns: contextColumns,
    sort,
    withRowActions,
    selection,
    columnManagement,
    totalItems,
  } = state
  const { sortBy, sortable: contextSortable } = sort
  const { isActive: columnManagementIsActive } = columnManagement
  const tableData = useTableData()

  useEffect(() => {
    setColumns(columns)
  }, [setColumns, columns])

  const renderSortingIcon = field => {
    const activeSort = sortBy && sortBy.field === field
    const activeSortOrder = activeSort && sortBy.order === orderTypes.DESC
    const classes = classNames(
      styles.sortingIcon,
      activeSort && styles.activeSort,
      activeSortOrder && styles.sortingIconDesc,
    )
    return <LongArrowIcon className={classes} />
  }

  const sortColumn = headerCell => {
    const sortOrder =
      headerCell.field === sortBy.field && sortBy.order === orderTypes.ASC
        ? orderTypes.DESC
        : orderTypes.ASC
    setSortBy({
      field: headerCell.field,
      order: sortOrder,
      type: headerCell.type,
    })
  }

  const handleHeaderCellClick = (headerCell, sortableColumn) => {
    onHeaderCellClick(headerCell)
    sortableColumn && sortColumn(headerCell)
  }

  const renderCell = headerCell => {
    const {
      field,
      content,
      sortable = true,
      hide,
      width,
      trailingIcon,
    } = headerCell
    if (hide) {
      return null
    }
    const style = getCellWidth(width)

    const sortableColumn = contextSortable && sortable
    const tableCellClass = classNames(styles.headerCell, {
      [styles.sortableColumn]: sortableColumn,
    })
    return (
      <div
        key={field}
        role='cell'
        style={style}
        className={tableCellClass}
        onClick={() => handleHeaderCellClick(headerCell, sortableColumn)}
      >
        {typeof content === 'function' ? (
          content()
        ) : (
          <div className={styles.ellipsis}>{content}</div>
        )}
        {!!trailingIcon && (
          <div className={styles.trailingIcon}>{trailingIcon}</div>
        )}
        {sortableColumn && renderSortingIcon(field)}
      </div>
    )
  }
  const handleSelectAll = () => {
    toggleSelectAll(tableData)
  }
  const renderSelection = () => {
    const { isActive, excludeMode, items } = selection
    const isAllSelected = excludeMode
      ? !items.length
      : !!(tableData.length && tableData.length === selection.items.length)
    if (!isActive) {
      return null
    }
    return (
      <div role={'cell'} className={styles.selectionCell}>
        <Checkbox
          checked={isAllSelected}
          indeterminate={!!items.length}
          onChange={handleSelectAll}
          disabled={!tableData.length}
        />
      </div>
    )
  }

  const renderActionsPlaceholder = () =>
    withRowActions &&
    !columnManagementIsActive && <div className={styles.columnManagementCell} />

  const renderColumnManagement = () =>
    columnManagementIsActive && (
      <div className={styles.columnManagementCell}>
        <IconButton
          onClick={() => setColumnManagementIsOpen(true)}
          size={'small'}
          variant={'ghost'}
        >
          <ManageColumnIcon />
        </IconButton>
      </div>
    )

  const classes = classNames(styles.tableHeader, className)

  return (
    <div>
      <div className={styles.results}>
        {totalItems} {getTranslation('results')}
      </div>
      <div role='row' className={classes} {...otherProps}>
        {renderSelection()}
        {contextColumns.map(renderCell)}
        {renderActionsPlaceholder()}
        {renderColumnManagement()}
      </div>
    </div>
  )
}

TableHeader.defaultProps = {
  onHeaderCellClick: () => {},
}

TableHeader.propTypes = {
  /** Table header fields. <br />
   *  <code>field</code>        		- match to the data properties. <br />
   *  <code>content</code>      		- what to render in the header cell.<br />
   *  <code>label</code>        		- display name to render on SSF and Column Management. <br />
   *  <code>type</code>         		- column type, use by SSF sort etc...
   *  									  <i style="background-color:#ffc40026;">NOTE: selfControlled free type SSF only work for string/number</i> <br />
   *  <code>columnRender</code> 		- custom column render. <code>(cellData, rowData) => {}</code>. <br />
   *  <code>columnRenderHover</code> 	- custom column render on hover. <code>(cellData, rowData) => {}</code>.<br />
   *  <code>sortable</code>  			  - set column is sortable. <br />
   *  <code>filterable</code>			  - set column is filterable. <br />
   *  <code>manageable</code>			  - set column is manageable. <br />
   *  <code>permanent</code>        - if true, disable uncheck column from column management. <br />
   *  <code>hide</code>         		- hide the column. <br />
   *  <code>width</code>    			  - set the column width by flex basis. <br />
   *  <code>triggerRowClick</code>  - set if cell is clickable, default true. <br />
   **/
  columns: propTypes.arrayOf(
    propTypes.shape({
      field: propTypes.string.isRequired,
      content: propTypes.oneOfType([propTypes.string, propTypes.func])
        .isRequired,
      label: propTypes.string,
      type: propTypes.oneOf(['string', 'number', 'date', 'bool']),
      columnRender: propTypes.func,
      columnRenderHover: propTypes.func,
      sortable: propTypes.bool,
      filterable: propTypes.bool,
      manageable: propTypes.bool,
      permanent: propTypes.bool,
      triggerRowClick: propTypes.bool,
      hide: propTypes.bool,
      width: propTypes.string,
    }),
  ).isRequired,
  /** Callback fire when header cell click with cell field. */
  onHeaderCellClick: propTypes.func,
  /** For css customization. */
  className: propTypes.string,
}

export default TableHeader
