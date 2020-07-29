import React, { useContext, useState } from 'react'
import classNames from 'classnames'
import events from '../../../../utils/enums/events'
import { getCellWidth } from '../../utlis'
import { Menu } from '../../../Menu'
import { IconButton } from '../../../IconButton'
import { ReactComponent as OptionsIcon } from '../../../../assets/svg/Options.svg'
import { Checkbox } from '../../../Checkbox'
import TableContext from '../../TableContext'
import { SkeletonLoader } from '../../../SkeletonLoader'
import styles from './TableRow.module.scss'

const TableRow = ({
  row,
  rowActions,
  rowHeight,
  isLoading,
  onRowClick,
}) => {
  const { state, toggleSelectedItem } = useContext(TableContext)
  const { selection, columns, columnManagement } = state

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
    if(!rowActions) return
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
          onClick={ e => e.stopPropagation() }
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

  const renderSelection = (row, isSelected) => {
    if(!selection.isActive) return
    return (
      <div
        role="cell"
        className={ styles.selectionCell }
      >
        <Checkbox
          onClick={ e => e.stopPropagation() }
          onChange={ () => toggleSelectedItem(row, isSelected) }
          checked={ isSelected }/>
      </div>
    )
  }

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

  const renderPlaceholder = () => {
    return (columnManagement.isActive && !rowActions) && (
      <div role={ 'cell' } className={ styles.actionsCell }/>
    )
  }

  const renderDataRow = () => {
    const isSelected = isRowSelected(row)
    const tableRowClassNames = classNames(styles.tableRow, { [styles.clickable]: onRowClick }, { [styles.selectedRow]: isSelected })
    return (
      <div
        role="row"
        style={ { height: rowHeight } }
        className={ tableRowClassNames }
        onMouseEnter={ mouseHoverHandler }
        onMouseLeave={ mouseHoverHandler }
        onClick={ () => onRowClick(row) }
      >
        { renderSelection(row, isSelected) }
        { columns.map(({
          field, columnRender, columnRenderHover, hide, width,
        }) => {
          if (hide) {
            return null
          }
          const style = getCellWidth(width)
          return (
            <div role="cell" style={ style } className={ styles.tableCell } key={ field }>
              { renderCell(row, field, columnRender, columnRenderHover) }
            </div>
          )
        }) }
        { renderPlaceholder() }
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
        columns.map(({
          field, hide, width
        }) => {
          if (hide) {
            return null
          }
          const style = getCellWidth(width)
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
