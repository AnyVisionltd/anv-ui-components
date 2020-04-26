import React from 'react'
import Snackbar from './Snackbar'
import { ReactComponent as SunIcon } from '../../assets/svg/Sun.svg'
import { centerDecorator } from '../../utils/storybook/decorators'
import styles from '../../styles/storybook/index.module.scss'

export default {
  title: 'Snackbar',
  component: Snackbar,
  decorators: [centerDecorator],
}

export const Default = () => (
  <Snackbar
    open
    message="This Is The Message"
  />
)

export const leadingIcon = () => (
  <Snackbar
    open
    message="This Is The Message"
    leadingIcon={ <SunIcon /> }
  />
)

export const trailingIcon = () => (
  <div className={ styles.marginFlexContainer }>
    <Snackbar
      open
      message="Default trailing icon"
    />
    <Snackbar
      open
      message="Custom trailing icon"
      trailingIcon={ <SunIcon /> }
    />
    <Snackbar
      open
      message="Without trailing icon"
      trailingIcon={ false }
    />
  </div>
)

export const actionText = () => (
  <Snackbar
    open
    message="This Is The Message"
    actionText="undo"
  />
)

export const withClassName = () => (
  <Snackbar
    open
    message="This Is The Message"
    actionText="undo"
    className={ styles.alertColor }
  />
)
