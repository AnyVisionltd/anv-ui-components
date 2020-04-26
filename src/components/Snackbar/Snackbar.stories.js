import React from 'react'
import Snackbar from './Snackbar'
import styles from '../../styles/storybook/index.module.scss'
import { ReactComponent as SunIcon } from '../../assets/svg/Sun.svg'
import { centerDecorator } from '../../utils/storybook/decorators'

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
  <div className={ styles.flexRow }>
    <Snackbar
      open
      message="Default trailing icon"
      className={ styles.microMargin }
    />
    <Snackbar
      open
      message="Custom trailing icon"
      className={ styles.microMargin }
      trailingIcon={ <SunIcon /> }
    />
    <Snackbar
      open
      message="Without trailing icon"
      className={ styles.microMargin }
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

export const color = () => (
  <Snackbar
    color="alert"
    open
    message="This Is The Message"
    actionText="undo"
    className={ styles.microMargin }
  />
)
