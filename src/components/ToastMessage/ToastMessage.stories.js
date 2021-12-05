import React, { useState, useCallback } from 'react'
import ToastMessage from './ToastMessage'
import { centerDecorator } from '../../utils/storybook/decorators'
import { Button } from '../Button'
import styles from '../../storybook/index.module.scss'

export default {
  title: 'User Feedback/ToastMessage',
  component: ToastMessage,
  decorators: [centerDecorator],
}

export const Default = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open</Button>
      <ToastMessage
        isOpen={isOpen}
        onClose={useCallback(() => setIsOpen(false), [])}
        message='Li Europan lingues es membres del sam familie. Lor separat existentie es un myth...'
      />
    </>
  )
}

export const ToastMessageTypes = () => {
  const [isOpenSuccess, setIsOpenSuccess] = useState(false)
  const [isOpenInfo, setIsOpenInfo] = useState(false)
  const [isOpenAlert, setIsOpenAlert] = useState(false)
  const [isOpenError, setIsOpenError] = useState(false)
  return (
    <>
      <div className={styles.marginFlexContainer}>
        <Button className={styles.successColor} variant='outline' onClick={() => setIsOpenSuccess(true)}>
          Success Message
        </Button>
        <Button className={styles.infoColor} variant='outline' onClick={() => setIsOpenInfo(true)}>
          Info Message
        </Button>
        <Button className={styles.alertColor} variant='outline' onClick={() => setIsOpenAlert(true)}>
          Alert Message
        </Button>
        <Button className={styles.errorColor} variant='outline' onClick={() => setIsOpenError(true)}>
          Error Message
        </Button>

      </div>
      <ToastMessage
        isOpen={isOpenSuccess}
        onClose={useCallback(() => setIsOpenSuccess(false), [])}
        message='Success Toast Message'
        type='success'
      />
      <ToastMessage
        isOpen={isOpenInfo}
        onClose={useCallback(() => setIsOpenInfo(false), [])}
        message='Info Toast Message'
        type='info'
      />
      <ToastMessage
        isOpen={isOpenAlert}
        onClose={useCallback(() => setIsOpenAlert(false), [])}
        message='Alert Toast Message'
        type='alert'
      />
      <ToastMessage
        isOpen={isOpenError}
        onClose={useCallback(() => setIsOpenError(false), [])}
        message='Error Toast Message'
        type='error'
      />
    </>
  )
}

export const WithUndoButton = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>With Undo Button</Button>
      <ToastMessage
        isOpen
        onClose={useCallback(() => setIsOpen(false), [])}
        message='This Is a Toast Message with undo button'
        isUndo={true}
        type='error'
        undoCallback={undoCallback}
      />
    </>
  )
}

const undoCallback = () => {
  alert('TEST undo callback - display an alert')
}
