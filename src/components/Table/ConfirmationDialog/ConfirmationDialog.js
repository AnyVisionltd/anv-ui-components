import React from 'react'
import propTypes from 'prop-types'
import { useComponentTranslation } from '../../../hooks/UseComponentTranslation'
import { Dialog, Button } from '../../../index'
import styles from './ConfirmationDialog.module.scss'

const ConfirmationDialog = ({
  isOpen,
  onConfirm,
  onDismiss,
  confirmDialogBody,
}) => {
  const { getComponentTranslation } = useComponentTranslation()
  const TableTranslations = getComponentTranslation('table')
  return (
    <Dialog
      className={styles.confirmationDialog}
      isOpen={isOpen}
      onClose={onDismiss}
    >
      <Dialog.Header>{TableTranslations.areYouSure}</Dialog.Header>
      <Dialog.Body>{confirmDialogBody}</Dialog.Body>
      <Dialog.Footer className={styles.footer}>
        <Button onClick={onDismiss} variant={'ghost'}>
          {TableTranslations.no}
        </Button>
        <Button onClick={onConfirm}>{TableTranslations.yes}</Button>
      </Dialog.Footer>
    </Dialog>
  )
}

ConfirmationDialog.propTypes = {
  isOpen: propTypes.bool,
  onConfirm: propTypes.func,
  onDismiss: propTypes.func,
  confirmDialogBody: propTypes.any,
}

export default ConfirmationDialog
