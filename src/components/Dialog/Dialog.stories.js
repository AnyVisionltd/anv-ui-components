import React, { useState } from "react"
import { boolean } from '@storybook/addon-knobs'
import { Dialog, Button } from '../../index'
import { centerDecorator } from '../../utils/storybook/decorators'
import styles from '../../styles/storybook/dialog.module.scss'

export default {
  title: 'Components/Dialog',
  component: Dialog,
  subcomponents: { Header: Dialog.Header, Body: Dialog.Body, Footer: Dialog.Footer },
  decorators: [centerDecorator],
}

export const Basic = () => {

  const [isDialogOpen, setDialogOpen] = useState(false)

  const handleOpenDialog = () => setDialogOpen(true)
  const handleCloseDialog = () => setDialogOpen(false)

  const disableBackdropClick = boolean('Disable backdrop click to close dialog', false)
  const disableEscapeKeyDown = boolean('Disable escape key press to close dialog', false)
  const closeIcon = boolean('Should the close icon be in header', true)

  return (
    <div>
      <Button
        aria-controls='menu-story-default'
        aria-haspopup='true'
        onClick={ handleOpenDialog }
      >
          Open Dialog
      </Button>
      <Dialog
        className={ styles.dialogExample }
        isOpen={ isDialogOpen }
        onClose={ handleCloseDialog }
        disableBackdropClick={ disableBackdropClick }
        disableEscapeKeyDown={ disableEscapeKeyDown }
      >
        <Dialog.Header closeIcon={ closeIcon }>
          Dialog Header Title
        </Dialog.Header>
        <Dialog.Body className={ styles.dialogBodyExample }>
          { 'Click outside or press escape key\nin order to close the dialog' }
        </Dialog.Body>
        <Dialog.Footer className={ styles.dialogFooterExample }>
          <div className={ styles.dialogFooterButtonsExample }>
            <Button variant={ 'ghost' } onClick={ handleCloseDialog }>
              Cancel
            </Button>
            <Button onClick={ handleCloseDialog }>
              Done
            </Button>
          </div>
        </Dialog.Footer>
      </Dialog>
    </div>
  )
}
