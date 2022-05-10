import React, { useContext, useEffect, useRef } from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import { useComponentTranslation } from '../../../hooks/UseComponentTranslation'
import { ReactComponent as NoResultsIcon } from '../../../assets/svg/NoResults.svg'
import { InfiniteList } from '../../../index'
import TableContext from '../TableContext'
import { TableRow } from './TableRow'
import { useTableData } from '../UseTableData'
import styles from './TableBody.module.scss'

const TableBody = ({
  data,
  totalItems,
  isLoading,
  loadMoreData,
  rowHeight,
  rowActions,
  onRowClick,
  className,
  menuClassName,
  onTableDataChanged,
  ...otherProps
}) => {
  const listRef = useRef()
  const containerRef = useRef()

  const { getComponentTranslation } = useComponentTranslation()
  const TableTranslations = getComponentTranslation('table')

  const {
    state,
    setData,
    setWithRowActions,
    setTotalItems,
    toggleSelectedItem,
  } = useContext(TableContext)
  const {
    columns,
    columnManagement,
    selection,
    selfControlled,
    filters,
    sort,
  } = state

  const tableData = useTableData()

  useEffect(() => {
    setData(data)
  }, [setData, data])

  useEffect(() => {
    listRef.current && listRef.current.scrollToItem(0)
  }, [filters, sort])

  useEffect(() => {
    setTotalItems(selfControlled ? tableData.length : totalItems)
    onTableDataChanged(tableData)
  }, [tableData, totalItems, selfControlled, setTotalItems])

  useEffect(() => {
    setWithRowActions(!!rowActions)
  }, [setWithRowActions, rowActions])

  const renderRow = (row, index) => {
    return (
      <TableRow
        isSelectionActive={!!selection.isActive}
        selectionEnabled={selection.checkRowSelectable(row)}
        isSelected={isRowSelected(row[selection.selectBy])}
        toggleSelectedItem={toggleSelectedItem}
        columns={columns}
        columnManagement={columnManagement.isActive}
        rowActions={rowActions}
        row={row}
        rowHeight={rowHeight}
        onRowClick={onRowClick}
        menuClassName={menuClassName}
      />
    )
  }
  const isRowSelected = selectField => {
    const { isActive, excludeMode, items, alwaysSelected } = selection
    if (!isActive) {
      return null
    }
    if (alwaysSelected.has(selectField)) return true
    let isSelected = items.some(rowId => rowId === selectField)
    return excludeMode ? !isSelected : isSelected
  }

  const calcItemsToFillHeight = () => {
    const height = containerRef.current.offsetHeight
    return Math.floor(height / rowHeight)
  }

  const loadingRender = () => {
    if (!isLoading) {
      return
    }

    const itemsToLoad = state.totalItems ? 5 : calcItemsToFillHeight()

    return Array.from({ length: itemsToLoad }, (_, index) => (
      <TableRow
        columns={columns}
        isLoading={true}
        key={index}
        rowHeight={rowHeight}
      />
    ))
  }

  const renderNoResults = () => (
    <div className={styles.noResults}>
      <NoResultsIcon />
      <div className={styles.noResultsTitle}>
        {TableTranslations.noResultsFound}
      </div>
      <div className={styles.noResultsMessage}>
        {TableTranslations.noResultsMessage}
      </div>
    </div>
  )

  const classes = classNames(styles.tableBody, className)

  return (
    <div className={classes} {...otherProps} ref={containerRef}>
      {state.totalItems ? (
        <InfiniteList
          rowHeight={rowHeight}
          totalItems={+totalItems}
          rowRender={renderRow}
          items={tableData}
          customLoader={loadingRender}
          isLoading={isLoading}
          loadMoreItems={loadMoreData}
          ref={listRef}
        />
      ) : isLoading && selfControlled ? (
        loadingRender()
      ) : (
        renderNoResults()
      )}
    </div>
  )
}

TableBody.defaultProps = {
  rowHeight: 56,
  onTableDataChanged: () => {},
}

TableBody.propTypes = {
  /**
   *  Array of items, each item represent row in the table. <br/>
   *  <b>id</b><span style="color: #FF4400">*</span> field is required for each item. <br/>
   *  The rows rely on <code>columns</code>,
   *  <code>prop</code> from <code><Table.Header/></code> component.
   */
  data: propTypes.arrayOf(propTypes.object).isRequired,
  /** The number of items. required when not self controlled */
  totalItems: propTypes.number,
  /** Table loading status */
  isLoading: propTypes.bool,
  /** Callback fire when need to fetch more data */
  loadMoreData: propTypes.func,
  /** The row height. <code>min-height: 48</code>. */
  rowHeight: propTypes.number,
  /** If pass, render action menu at the end of each row. */
  rowActions: propTypes.arrayOf(
    propTypes.shape({
      /** The label to render inside the <Menu.Items/>. */
      label: propTypes.string,
      /** The icon to render before the label. */
      icon: propTypes.node,
      /**
       * if pass confirmation dialog will show after click the action.
       * confirmDialogBody can be string or JSX components
       * for example <div>Are you sure make this action?</div>
       * */
      confirmDialogBody: propTypes.any,
      /** The callback when click the <Menu.Items/> */
      onClick: propTypes.func,
      /** A callback function that returns a bool value that determines if the specific row action should be rendered */
      hidden: propTypes.func,
    }),
  ),
  /** Callback fire when row click. */
  onRowClick: propTypes.func,
  /** For css customization. */
  className: propTypes.string,
  /** For Menu customization */
  menuClassName: propTypes.string,
  /** Callback fire when table data changes (filters changed, sort, etc.) */
  onTableDataChanged: propTypes.func,
}

export default TableBody
