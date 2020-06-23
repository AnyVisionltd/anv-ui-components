import React, { useState, useContext, useEffect } from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import { IconButton, Menu, Checkbox, SkeletonLoader, InfiniteList } from '../../../index'
import { ReactComponent as OptionsIcon } from '../../../assets/svg/Options.svg'
import TableContext from '../TableContext'
import { useTableData } from "../UseTableData"
import styles from './TableBody.module.scss'

const TableBody = ({
  data,
  totalItems,
  isLoading,
  loadMoreData,
  rowHeight,
  rowActions,
  className,
  ...otherProps
}) => {
  const { state, setData, setWithRowActions, toggleSelectedItem, setTotalItems } = useContext(TableContext)
  const { headers, selection, selfControlled } = state

  const tableData = useTableData()

  const [actionsAnchorElement, setActionsAnchorElement] = useState(null)

  useEffect(() => {
    setData(data)
  }, [setData, data])

  useEffect(() => {
    setTotalItems(selfControlled ? data.length : totalItems)
  }, [data, totalItems, selfControlled, setTotalItems])

  useEffect(() => {
    setWithRowActions(!!rowActions)
  }, [setWithRowActions, rowActions])

  const handleActionsClick = event => {
    setActionsAnchorElement(actionsAnchorElement ? null : event.currentTarget)
  }

  const handleActionsClose = () => {
    setActionsAnchorElement(null)
  }

  const handleMenuItemClick = (row, onClick) => {
    handleActionsClose()
    onClick(row)
  }

  const renderActions = row => {
    if (!rowActions) {
	  return
    }
    return (
	  <>
        <Menu
		  anchorElement={ actionsAnchorElement }
		  isOpen={ !!actionsAnchorElement }
		  preferOpenDirection="down-start"
		  onClose={ handleActionsClose }
        >
		  {
            rowActions.map(({ content, onClick }, index) => (
			  <Menu.Item
                key={ index }
                onClick={ () => handleMenuItemClick(row, onClick) }
			  >
                { content }
			  </Menu.Item>
            ))
		  }
        </Menu>
        <div
		  role="cell"
		  className={ styles.actionsCell }
        >
		  <IconButton
            className={ styles.actionButton }
            variant="ghost"
            onClick={ handleActionsClick }
		  >
            <OptionsIcon/>
		  </IconButton>
        </div>
	  </>
    )
  }

  const isRowSelected = ({ id }) => {
    const { isActive, excludeMode, items } = selection
    if (!isActive) {
	  return null
    }
    let isSelected = items.some(rowId => rowId === id)
    return excludeMode ? !isSelected : isSelected
  }

  const renderSelection = (row, isSelected) => (
    <div
	  role="cell"
	  className={ styles.selectionCell }
    >
	  <Checkbox onChange={ () => toggleSelectedItem(row, isSelected) }
        checked={ isSelected }/>
    </div>
  )

  const renderRow = row => {
    const isSelected = isRowSelected(row)
    const tableRowClassNames = classNames(styles.tableRow, { [styles.selectedRow]: isSelected })
    return  (
      <div
        role="row"
        style={ { height: rowHeight } }
        className={ tableRowClassNames }
      >
        { renderSelection(row, isSelected) }
        { headers.map(({
          field, columnRender, hide, flexWidth,
        }) => {
          if (hide) {
            return null
          }
          const style = flexWidth ? { flex: `0 0 ${flexWidth}` } : {}
          return (
            <div role="cell" style={ style } className={ styles.tableCell } key={ field }>
              { columnRender ? columnRender(row[field], row) : row[field] }
            </div>
          )
        }) }
        { /* { renderDynamicColumnPlaceholder() } */ }
        { renderActions(row) }
      </div>
    )
  }

  const loadingRender = () => {
    if(!isLoading) {
      return
    }

    return Array.from({ length: 5 }, (_, index) => (
      <div
        role={ 'row' }
        className={ styles.tableRow }
        key={ index }
      >
        <div
          role="cell"
          className={ styles.selectionCell }
        >
          <SkeletonLoader className={ styles.circleSkeleton }/>
        </div>
        {
          headers.map(({
            field, hide, flexWidth
          }) => {
            if (hide) {
              return null
            }
            const style = flexWidth ? { flex: `0 0 ${flexWidth}` } : {}
            return (
              <div role="cell" style={ style } className={ styles.tableCell } key={ field }>
                <SkeletonLoader className={ styles.lineSkeleton }/>
              </div>
            )
          })
        }
        <div className={ styles.actionsCell }/>
      </div>
    ))
  }

  const classes = classNames(
    styles.tableBody,
    className,
  )

  return (
    <div
      className={ classes }
	    { ...otherProps }
    >
	    <InfiniteList
        totalItems={ +totalItems }
        rowRender={ row => renderRow(row) }
        items={ tableData }
        customLoader={ loadingRender }
        isLoading={ isLoading }
        loadMoreItems={ loadMoreData }
      >
      </InfiniteList>
    </div>
  )
}

TableBody.defaultProps = {
  rowHeight: '56px',
}

TableBody.propTypes = {
  /**  Array of items, each item represent row in the table. <br/>
   *  <b>id</b><span style="color: #FF4400">*</span> field is required for each item. <br/>
   *  The rows rely on <code>headers</code>,
   *  <code>prop</code> from <code><Table.Header/></code> component.
   */
  data: propTypes.arrayOf(propTypes.object).isRequired,
  /** The number of items. required when not self controlled */
  totalItems: propTypes.number,
  /** Table loading status */
  isLoading: propTypes.bool,
  /** Callback fire when need to fetch more data */
  loadMoreData: propTypes.func,
  /** The row height. <code>min-height: 48px</code>. */
  rowHeight: propTypes.string,
  /** If pass, render action menu at the end of each row. */
  rowActions: propTypes.arrayOf(propTypes.shape({
    /** The content to render inside the <Menu.Items/>. */
    content: propTypes.node,
    /** The callback when click the <Menu.Items/> */
    onClick: propTypes.func,
  })),
  /** For css customization. */
  className: propTypes.string,
}

export default TableBody
