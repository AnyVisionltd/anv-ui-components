import React from 'react'
import languageService from '../../../services/language'
import { Dialog, Button } from '../../../index'
import styles from './ConfirmationDialog.module.scss'

const getTranslation = path => languageService.getTranslation(`${path}`)

const ConfirmationDialog = ({ isOpen, onConfirm, onDismiss }) => (
  <Dialog className={ styles.confirmationDialog } isOpen={ isOpen } onClose={ onDismiss }>
    <Dialog.Header>{ getTranslation('areYouSure') }</Dialog.Header>
    <Dialog.Body>Are you sure you want to delete?</Dialog.Body>
    <Dialog.Footer className={ styles.footer }>
	  <Button onClick={ onDismiss } variant={ 'ghost' }>{ getTranslation('no') }</Button>
	  <Button onClick={ onConfirm }>{ getTranslation('yes') }</Button>
    </Dialog.Footer>
  </Dialog>
)

export default ConfirmationDialog