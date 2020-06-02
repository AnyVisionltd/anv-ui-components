import React, { useState } from "react"
import Dialog from './Dialog'
import { Button } from '../Button'
import { centerDecorator } from '../../utils/storybook/decorators'
import styles from '../../styles/storybook/dialog.module.scss'

export default {
  title: 'Components/Dialog',
  component: Dialog,
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
      <Dialog className={ styles.dialogExample } isOpen={ isDialogOpen } onClose={ handleCloseDialog }>
          Click outside to close
      </Dialog>
    </div>
  )
}
