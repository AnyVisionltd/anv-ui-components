import React from 'react'
import propTypes from 'prop-types'
import languageService from '../../../services/language'
import { Dialog, Button } from '../../../index'
import styles from './ConfirmationDialog.module.scss'

const getTranslation = path => languageService.getTranslation(`${path}`)

const ConfirmationDialog = ({
  isOpen,
  onConfirm,
  onDismiss,
  confirmDialogBody,
}) => (
  <Dialog
    className={styles.confirmationDialog}
    isOpen={isOpen}
    onClose={onDismiss}
  >
    <Dialog.Header>{getTranslation('areYouSure')}</Dialog.Header>
    <Dialog.Body>{confirmDialogBody}</Dialog.Body>
    <Dialog.Footer className={styles.footer}>
      <Button onClick={onDismiss} variant={'ghost'}>
        {getTranslation('no')}
      </Button>
      <Button onClick={onConfirm}>{getTranslation('yes')}</Button>
    </Dialog.Footer>
  </Dialog>
)

ConfirmationDialog.propTypes = {
  isOpen: propTypes.bool,
  onConfirm: propTypes.func,
  onDismiss: propTypes.func,
  confirmDialogBody: propTypes.any,
}

export default ConfirmationDialog
