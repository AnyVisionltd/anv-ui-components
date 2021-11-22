import React, { useState, useCallback } from 'react'
import ToastMessage from './ToastMessage'
import { ReactComponent as SunIcon } from '../../assets/svg/Sun.svg'
import { ReactComponent as CheckIcon } from '../../assets/svg/Check.svg'
import { centerDecorator } from '../../utils/storybook/decorators'
import styles from '../../storybook/index.module.scss'
import { Button } from '../Button'

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
        message='This Is The Message'
      />
    </>
  )
}

export const LeadingIcon = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>With Leading Icon</Button>
      <ToastMessage
        isOpen={isOpen}
        onClose={useCallback(() => setIsOpen(false), [])}
        message='This Is The Message'
        leadingIcon={<SunIcon />}
      />
    </>
  )
}

export const CloseIcon = () => {
  const [isOpenDefault, setIsOpenDefault] = useState(false)
  const [isOpenCustom, setIsOpenCustom] = useState(false)
  const [isOpenWithout, setIsOpenWithout] = useState(false)
  return (
    <>
      <div className={styles.marginFlexContainer}>
        <Button onClick={() => setIsOpenDefault(true)}>Default Icon</Button>
        <Button onClick={() => setIsOpenCustom(true)}>Custom Icon</Button>
        <Button onClick={() => setIsOpenWithout(true)}>Without Icon</Button>
      </div>
      <ToastMessage
        isOpen={isOpenDefault}
        onClose={useCallback(() => setIsOpenDefault(false), [])}
        message='Default trailing icon'
      />
      <ToastMessage
        isOpen={isOpenCustom}
        onClose={useCallback(() => setIsOpenCustom(false), [])}
        message='Custom trailing icon'
        closeIcon={<CheckIcon />}
      />
      <ToastMessage
        isOpen={isOpenWithout}
        onClose={useCallback(() => setIsOpenWithout(false), [])}
        message='Without trailing icon'
        closeIcon={false}
      />
    </>
  )
}

export const Action = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>With Action</Button>
      <ToastMessage
        isOpen={isOpen}
        onClose={useCallback(() => setIsOpen(false), [])}
        message='This Is The Message'
        action={
          <Button variant='ghost' size='small'>
            {' '}
            undo{' '}
          </Button>
        }
      />
    </>
  )
}
