import React, { memo, useState } from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import { formatDateTime } from '../../../../services/date'
import { events, types } from '../../../../utils/enums'
import { getCellWidth } from '../../utlis'
import { Menu } from '../../../Menu'
import { IconButton } from '../../../IconButton'
import { ReactComponent as OptionsIcon } from '../../../../assets/svg/Options.svg'
import { Checkbox } from '../../../Checkbox'
import { SkeletonLoader } from '../../../SkeletonLoader'
import { ConfirmationDialog } from '../../ConfirmationDialog'
import styles from './TableRow.module.scss'
import { Tooltip } from '../../../Tooltip'

const TableRow = ({
  row,
  rowActions,
  rowHeight,
  isLoading,
  onRowClick,
  isSelected,
  isActive,
  columns,
  toggleSelectedItem,
  columnManagement,
}) => {
  const [actionsAnchorElement, setActionsAnchorElement] = useState(null)
  const [isHover, setIsHover] = useState(false)
  const [confirmationDialog, setConfirmationDialog] = useState({
    confirmMessage: '',
    onConfirm: () => {},
  })

  const handleActionsClose = () => {
    setActionsAnchorElement(null)
  }

  const dismissConfirmationDialog = () => {
    setConfirmationDialog({ confirmMessage: '' })
  }

  const handleMenuItemClick = (e, row, onClick, confirmMessage) => {
    e.stopPropagation()
    if (confirmMessage) {
      setConfirmationDialog({
        confirmMessage,
        onConfirm: () => {
          onClick(row)
          dismissConfirmationDialog()
        },
      })
    } else {
      onClick(row)
    }
    handleActionsClose()
  }

  const handleActionsClick = event => {
    setActionsAnchorElement(actionsAnchorElement ? null : event.currentTarget)
  }

  const renderActions = row => {
    if (!rowActions) return
    return (
      <>
        <Menu
          anchorElement={actionsAnchorElement}
          isOpen={!!actionsAnchorElement}
          preferOpenDirection='bottom-end'
          onClose={handleActionsClose}
        >
          {rowActions
            .filter(({ hidden }) => !hidden || !hidden(row))
            .map(({ label, icon, hidden, onClick, confirmMessage }, index) => (
              <Menu.Item
                leadingComponent={icon}
                key={index}
                onClick={e =>
                  handleMenuItemClick(e, row, onClick, confirmMessage)
                }
              >
                {label}
              </Menu.Item>
            ))}
        </Menu>
        <div
          role='cell'
          className={styles.actionsCell}
          onClick={e => e.stopPropagation()}
        >
          <IconButton
            className={styles.actionButton}
            variant='ghost'
            onClick={handleActionsClick}
          >
            <OptionsIcon />
          </IconButton>
        </div>
      </>
    )
  }

  const renderSelection = (row, isSelected) => {
    if (!isActive) return
    return (
      <div
        role='cell'
        className={styles.selectionCell}
        onClick={e => handleCellClick({ e, row, triggerRowClick: false })}
      >
        <Checkbox
          onClick={e => e.stopPropagation()}
          onChange={() => toggleSelectedItem(row, isSelected)}
          checked={isSelected}
        />
      </div>
    )
  }

  const renderCell = (row, field, columnRender, columnRenderHover, type) => {
    if (isHover && columnRenderHover) {
      return columnRenderHover(row[field], row)
    } else if (columnRender) {
      return columnRender(row[field], row)
    } else if (type === types.STRING || type === types.NUMBER) {
      return (
        <Tooltip overflowOnly={true} content={row[field]}>
          <div className={styles.ellipsis}>{row[field]}</div>
        </Tooltip>
      )
    } else if (type === types.DATE) {
      return <div className={styles.ellipsis}>{formatDateTime(row[field])}</div>
    }
    return row[field]
  }

  const mouseHoverHandler = ({ type }) => {
    const isHover = type === events.MOUSE_ENTER
    setIsHover(isHover)
  }

  const renderPlaceholder = () => {
    return (
      columnManagement &&
      !rowActions && <div role={'cell'} className={styles.actionsCell} />
    )
  }

  const handleRowClick = row => {
    onRowClick(row)
  }

  const handleCellClick = ({ e, row, triggerRowClick }) => {
    e.stopPropagation()
    if (triggerRowClick) {
      handleRowClick(row)
    }
  }

  const renderDataRow = () => {
    const tableRowClassNames = classNames(
      styles.tableRow,
      { [styles.triggerRowClick]: onRowClick },
      { [styles.selectedRow]: isSelected },
    )
    return (
      <div
        role='row'
        style={{ height: `${rowHeight}px` }}
        className={tableRowClassNames}
        onMouseEnter={mouseHoverHandler}
        onMouseLeave={mouseHoverHandler}
        onClick={() => handleRowClick(row)}
      >
        {renderSelection(row, isSelected)}
        {columns.map(
          ({
            field,
            columnRender,
            columnRenderHover,
            hide,
            width,
            type,
            triggerRowClick = true,
          }) => {
            if (hide) {
              return null
            }
            const style = getCellWidth(width)
            return (
              <div
                role='cell'
                style={style}
                className={styles.tableCell}
                key={field}
                onClick={e => handleCellClick({ e, row, triggerRowClick })}
              >
                {renderCell(row, field, columnRender, columnRenderHover, type)}
              </div>
            )
          },
        )}
        {renderPlaceholder()}
        {renderActions(row)}
      </div>
    )
  }

  const renderLoadingRow = () => (
    <div role={'row'} className={styles.tableRow}>
      <div role='cell' className={styles.selectionCell}>
        <SkeletonLoader className={styles.circleSkeleton} />
      </div>
      {columns.map(({ field, hide, width }) => {
        if (hide) {
          return null
        }
        const style = getCellWidth(width)
        return (
          <div
            role='cell'
            style={style}
            className={styles.tableCell}
            key={field}
          >
            <SkeletonLoader className={styles.lineSkeleton} />
          </div>
        )
      })}
      <div className={styles.actionsCell} />
    </div>
  )

  return (
    <>
      <ConfirmationDialog
        isOpen={!!confirmationDialog.confirmMessage}
        onConfirm={confirmationDialog.onConfirm}
        onDismiss={dismissConfirmationDialog}
        confirmMessage={confirmationDialog.confirmMessage}
      />
      {isLoading ? renderLoadingRow() : renderDataRow()}
    </>
  )
}

TableRow.defaultProps = {
  onRowClick: () => {},
}

TableRow.propTypes = {
  row: propTypes.object,
  rowActions: propTypes.array,
  rowHeight: propTypes.number,
  isLoading: propTypes.bool,
  onRowClick: propTypes.func,
}

export default memo(TableRow)
