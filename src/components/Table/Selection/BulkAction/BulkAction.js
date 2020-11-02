import React, { useContext, useRef, useState } from 'react'
import propTypes from 'prop-types'
import { IconButton, Menu } from '../../../../index'
import TableContext from '../../TableContext'
import { ConfirmationDialog } from '../../ConfirmationDialog'
import styles from './BulkAction.module.scss'

const BulkAction = ({ icon, onClick, subMenu, confirmMessage }) => {
  const { state } = useContext(TableContext)
  const { items, excludeMode } = state.selection
  const moreActionsRef = useRef()
  const [anchorElement, setAnchorElement] = useState(null)
  const [confirmationDialog, setConfirmationDialog] = useState({
    confirmMessage: '',
    onConfirm: () => {},
  })

  const handleMenuClose = () => setAnchorElement(null)
  const handleButtonClick = () =>
    anchorElement
      ? setAnchorElement(null)
      : setAnchorElement(moreActionsRef.current)

  const handleClick = onClick => {
    onClick({ items, excludeMode })
  }

  const handleDismissConfirmationDialog = () => {
    setConfirmationDialog({ confirmMessage: '' })
  }

  const handleActionClick = (onClick, confirmMessage, subMenu) => {
    if (subMenu) {
      handleButtonClick()
    } else if (confirmMessage) {
      setConfirmationDialog({
        confirmMessage,
        onConfirm: () => handleClick(onClick),
      })
    } else {
      handleClick(onClick)
    }
  }

  const handleConfirmDialog = () => {
    confirmationDialog.onConfirm()
    setConfirmationDialog({ confirmMessage: '' })
  }

  return (
    <>
      <ConfirmationDialog
        isOpen={!!confirmationDialog.confirmMessage}
        onConfirm={handleConfirmDialog}
        onDismiss={handleDismissConfirmationDialog}
        confirmMessage={confirmationDialog.confirmMessage}
      />
      <IconButton
        onClick={() => handleActionClick(onClick, confirmMessage, subMenu)}
        variant={'ghost'}
        ref={moreActionsRef}
        className={styles.actionButton}
      >
        {icon}
      </IconButton>
      {subMenu && (
        <Menu
          isOpen={!!anchorElement}
          onClose={handleMenuClose}
          anchorElement={anchorElement}
          preferOpenDirection='bottom-end'
        >
          {subMenu.map(({ onClick, icon, label, confirmMessage }) => (
            <Menu.Item
              onClick={() => handleActionClick(onClick, confirmMessage)}
              key={label}
              leadingComponent={icon}
            >
              {label}
            </Menu.Item>
          ))}
        </Menu>
      )}
    </>
  )
}
BulkAction.defaultProps = {
  icon: null,
}

BulkAction.propTypes = {
  icon: propTypes.node,
  onClick: propTypes.func,
  /** Table bulk actions. <br />
   *  <code>icon</code>             - icon for the action. <br />
   *  <code>label</code>            - label for the action icon.<br />
   *  <code>confirmMessage</code>   - if pass confirmation dialog will show after click the action. <br />
   *  <code>onClick</code>          - callback fire when action click. <br />
   **/
  subMenu: propTypes.arrayOf(
    propTypes.shape({
      icon: propTypes.node,
      label: propTypes.string,
      confirmMessage: propTypes.string,
      onClick: propTypes.func.isRequired,
    }),
  ),
  confirmMessage: propTypes.string,
  /** Selection bar css customization. */
  className: propTypes.string,
}
export default BulkAction
