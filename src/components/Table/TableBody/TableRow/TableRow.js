import React, { useContext, useState } from 'react'
import classNames from 'classnames'
import events from '../../../../utils/enums/events'
import { Menu } from '../../../Menu'
import { IconButton } from '../../../IconButton'
import { ReactComponent as OptionsIcon } from '../../../../assets/svg/Options.svg'
import { Checkbox } from '../../../Checkbox'
import TableContext from '../../TableContext'
import { SkeletonLoader } from '../../../SkeletonLoader'
import styles from "../TableBody.module.scss"

const TableRow = ({ row, rowActions, rowHeight, isLoading }) => {
  const { state, toggleSelectedItem } = useContext(TableContext)
  const { selection, headers } = state

  const [actionsAnchorElement, setActionsAnchorElement] = useState(null)
  const [isHover, setIsHover] = useState(false)

  const handleActionsClose = () => {
    setActionsAnchorElement(null)
  }

  const handleMenuItemClick = (row, onClick) => {
    handleActionsClose()
    onClick(row)
  }

  const handleActionsClick = event => {
    setActionsAnchorElement(actionsAnchorElement ? null : event.currentTarget)
  }

  const renderActions = row => {
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
      <Checkbox
        onChange={ () => toggleSelectedItem(row, isSelected) }
        checked={ isSelected }/>
    </div>
  )

  const renderCell = (row, field, columnRender, columnRenderHover) => {
    if(isHover && columnRenderHover) {
      return columnRenderHover(row[field], row)
    } else if (columnRender) {
      return columnRender(row[field], row)
    }
    return row[field]
  }

  const mouseHoverHandler = ({ type }) => {
    const isHover = type === events.MOUSE_ENTER
    setIsHover(isHover)
  }

  const renderDataRow = () => {
    const isSelected = isRowSelected(row)
    const tableRowClassNames = classNames(styles.tableRow, { [styles.selectedRow]: isSelected })
    return (
      <div
        role="row"
        style={ { height: rowHeight } }
        className={ tableRowClassNames }
        onMouseEnter={ mouseHoverHandler }
        onMouseLeave={ mouseHoverHandler }
      >
        { renderSelection(row, isSelected) }
        { headers.map(({
          field, columnRender, columnRenderHover, hide, flexWidth,
        }) => {
          if (hide) {
            return null
          }
          const style = flexWidth ? { flex: `0 0 ${flexWidth}` } : {}
          return (
            <div role="cell" style={ style } className={ styles.tableCell } key={ field }>
              { renderCell(row, field, columnRender, columnRenderHover) }
            </div>
          )
        }) }
        { /* { renderDynamicColumnPlaceholder() } */ }
        { renderActions(row) }
      </div>
    )
  }

  const renderLoadingRow = () => (
    <div
      role={ 'row' }
      className={ styles.tableRow }
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
  )

  return (
    <>
      { isLoading ? renderLoadingRow(): renderDataRow() }
    </>
  )
}

export default TableRow
