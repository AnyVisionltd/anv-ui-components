import React from 'react'
import { select, boolean } from '@storybook/addon-knobs'
import { Sun } from '@anyvision/anv-icons'
import IconButton from './IconButton'
import styles from '../../storybook/index.module.scss'
import { centerDecorator } from '../../utils/storybook/decorators'

export default {
  title: 'Components/IconButton',
  component: IconButton,
  decorators: [centerDecorator],
}

export const Default = () => (
  <IconButton>
    <Sun />
  </IconButton>
)

export const variants = () => (
  <div className={ styles.marginFlexContainer }>
    <IconButton>
      <Sun />
    </IconButton>
    <IconButton variant="outline">
      <Sun />
    </IconButton>
    <IconButton variant="ghost">
      <Sun />
    </IconButton>
  </div>
)

export const sizes = () => (
  <div className={ styles.marginFlexContainer }>
    <IconButton><Sun /></IconButton>
    <IconButton size="medium"><Sun /></IconButton>
    <IconButton size="large"><Sun /></IconButton>
  </div>
)


export const disable = () => (
  <div className={ styles.marginFlexContainer }>
    <IconButton><Sun /></IconButton>
    <IconButton disabled><Sun /></IconButton>
  </div>
)

export const withClassName = () => (
  <div className={ styles.marginFlexContainer }>
    { /* background-color: av-color(success); */ }
    <IconButton className={ styles.successBackgroundColor }>
      <Sun />
    </IconButton>
    { /* color: av-color(alert); */ }
    <IconButton className={ styles.alertColor } variant="outline">
      <Sun />
    </IconButton>
    { /* color: av-color(error); */ }
    <IconButton className={ styles.errorColor } variant="ghost">
      <Sun />
    </IconButton>
  </div>
)

export const playGround = () => (
  <IconButton
    size={ select('size', ['small', 'medium', 'large'], 'small') }
    variant={ select('variant', ['fill', 'outline', 'ghost'], 'fill') }
    disabled={ boolean('disabled', false) }
  >
    <Sun />
  </IconButton>
)
