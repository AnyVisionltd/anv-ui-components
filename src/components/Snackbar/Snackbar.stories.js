import React, { useState } from 'react'
import Snackbar from './Snackbar'
import { ReactComponent as SunIcon } from '../../assets/svg/Sun.svg'
import { centerDecorator } from '../../utils/storybook/decorators'
import styles from '../../styles/storybook/index.module.scss'
import { Button } from '../Button'

export default {
  title: 'Snackbar',
  component: Snackbar,
  decorators: [centerDecorator],
}

export const Default = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <Button onClick={ () => setIsOpen(true) }>Open</Button>
      <Snackbar
        open={ isOpen }
        onClose={ () => setIsOpen(false) }
        message="This Is The Message"
      />
    </>
  )
}

export const LeadingIcon = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <Button onClick={ () => setIsOpen(true) }>Open</Button>
      <Snackbar
        open={ isOpen }
        onClose={ () => setIsOpen(false) }
        message="This Is The Message"
        leadingIcon={ <SunIcon /> }
      />
    </>
  )
}

export const TrailingIcon = () => {
  const [isOpenDefault, setIsOpenDefault] = useState(false)
  const [isOpenCustom, setIsOpenCustom] = useState(false)
  const [isOpenWithout, setIsOpenWithout] = useState(false)
  return (
    <>
      <div className={ styles.marginFlexContainer }>
        <Button onClick={ () => setIsOpenDefault(true) }>Default Icon</Button>
        <Button onClick={ () => setIsOpenCustom(true) }>Custom Icon</Button>
        <Button onClick={ () => setIsOpenWithout(true) }>Without Icon</Button>
      </div>
      <Snackbar
        open={ isOpenDefault }
        onClose={ () => setIsOpenDefault(false) }
        message="Default trailing icon"
      />
      <Snackbar
        open={ isOpenCustom }
        onClose={ () => setIsOpenCustom(false) }
        message="Custom trailing icon"
        trailingIcon={ <SunIcon /> }
      />
      <Snackbar
        open={ isOpenWithout }
        onClose={ () => setIsOpenWithout(false) }
        message="Without trailing icon"
        trailingIcon={ false }
      />
    </>
  )
}

export const ActionText = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <Button onClick={ () => setIsOpen(true) }>Open</Button>
      <Snackbar
        open={ isOpen }
        onClose={ () => setIsOpen(false) }
        message="This Is The Message"
        actionText="undo"
      />
    </>
  )
}
