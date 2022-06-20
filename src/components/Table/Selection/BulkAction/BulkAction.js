import React, { useContext, useRef, useState } from 'react'
import propTypes from 'prop-types'
import { IconButton, Menu } from '../../../../index'
import TableContext from '../../TableContext'
import { ConfirmationDialog } from '../../ConfirmationDialog'
import styles from './BulkAction.module.scss'

const BulkAction = ({ icon, label, onClick, subMenu, confirmDialogBody }) => {
  const { state } = useContext(TableContext)
  const { items, excludeMode } = state.selection
  const moreActionsRef = useRef()
  const [anchorElement, setAnchorElement] = useState(null)
  const [confirmationDialog, setConfirmationDialog] = useState({
    confirmDialogBody: '',
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
    setConfirmationDialog({ confirmDialogBody: '' })
  }

  const handleActionClick = (onClick, confirmDialogBody, subMenu) => {
    if (subMenu) {
      handleButtonClick()
    } else if (confirmDialogBody) {
      setConfirmationDialog({
        confirmDialogBody,
        onConfirm: () => handleClick(onClick),
      })
    } else {
      handleClick(onClick)
    }
  }

  const handleConfirmDialog = () => {
    confirmationDialog.onConfirm()
    setConfirmationDialog({ confirmDialogBody: '' })
  }

  return (
    <>
      <ConfirmationDialog
        isOpen={!!confirmationDialog.confirmDialogBody}
        onConfirm={handleConfirmDialog}
        onDismiss={handleDismissConfirmationDialog}
        confirmDialogBody={confirmationDialog.confirmDialogBody}
      />
      <IconButton
        onClick={() => handleActionClick(onClick, confirmDialogBody, subMenu)}
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
          preferOpenDirection='top-end'
        >
          {subMenu.map(({ onClick, icon, label, confirmDialogBody }) => (
            <Menu.Item
              onClick={() => handleActionClick(onClick, confirmDialogBody)}
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
   *  <code>confirmDialogBody</code>   - if pass confirmation dialog will show after click the action. <br />
   *  <code>onClick</code>          - callback fire when action click. <br />
   **/
  subMenu: propTypes.arrayOf(
    propTypes.shape({
      icon: propTypes.node,
      label: propTypes.string,
      confirmDialogBody: propTypes.any,
      onClick: propTypes.func.isRequired,
    }),
  ),
  confirmDialogBody: propTypes.any,
  /** Selection bar css customization. */
  className: propTypes.string,
}
export default BulkAction
