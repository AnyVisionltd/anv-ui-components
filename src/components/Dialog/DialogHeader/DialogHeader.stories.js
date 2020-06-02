import React, { useState } from "react"
import Dialog from '../Dialog'
import DialogHeader from './DialogHeader'
import { Button } from '../../Button'
import { centerDecorator } from '../../../utils/storybook/decorators'
import styles from '../../../styles/storybook/dialog.module.scss'

export default {
  title: 'Components/Dialog/DialogHeader',
  component: DialogHeader,
  decorators: [centerDecorator],
}

export const Default = () => {

  const [isDialogOpen, setDialogOpen] = useState(false)

  const handleOpenDialog = () => setDialogOpen(true)
  const handleCloseDialog = () => setDialogOpen(false)

  return (
    <div>
      <Button
        aria-controls='menu-story-default'
        aria-haspopup='true'
        onClick={ handleOpenDialog }
      >
        Open Dialog
      </Button>
      <Dialog className={ styles.dialogWithHeaderExample } isOpen={ isDialogOpen } onClose={ handleCloseDialog }>
        <DialogHeader>
          Dialog Header Title
        </DialogHeader>
      </Dialog>
    </div>
  )
}

export const WithCloseIcon = () => {

  const [isDialogOpen, setDialogOpen] = useState(false)

  const handleOpenDialog = () => setDialogOpen(true)
  const handleCloseDialog = () => setDialogOpen(false)

  return (
    <div>
      <Button
        aria-controls='menu-story-default'
        aria-haspopup='true'
        onClick={ handleOpenDialog }
      >
        Open Dialog
      </Button>
      <Dialog className={ styles.dialogWithHeaderExample } isOpen={ isDialogOpen } onClose={ handleCloseDialog }>
        <DialogHeader onClose={ handleCloseDialog }>
          Dialog Header Title
        </DialogHeader>
      </Dialog>
    </div>
  )
}
