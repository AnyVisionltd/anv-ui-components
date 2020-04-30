import React from 'react'
import { select, boolean } from '@storybook/addon-knobs'
import { ReactComponent as SunIcon } from '../../assets/svg/Sun.svg'
import IconButton from './IconButton'
import styles from '../../styles/storybook/index.module.scss'
import { centerDecorator } from '../../utils/storybook/decorators'

export default {
  title: 'Components|IconButton',
  component: IconButton,
  decorators: [centerDecorator],
}

export const Default = () => (
  <IconButton>
    <SunIcon />
  </IconButton>
)

export const variants = () => (
  <div className={ styles.marginFlexContainer }>
    <IconButton>
      <SunIcon />
    </IconButton>
    <IconButton variant="outline">
      <SunIcon />
    </IconButton>
    <IconButton variant="ghost">
      <SunIcon />
    </IconButton>
  </div>
)

export const sizes = () => (
  <div className={ styles.marginFlexContainer }>
    <IconButton><SunIcon /></IconButton>
    <IconButton size="large"><SunIcon /></IconButton>
  </div>
)


export const disable = () => (
  <div className={ styles.marginFlexContainer }>
    <IconButton><SunIcon /></IconButton>
    <IconButton disabled><SunIcon /></IconButton>
  </div>
)

export const withClassName = () => (
  <div className={ styles.marginFlexContainer }>
    { /* background-color: av-color(success); */ }
    <IconButton className={ styles.successBackgroundColor }>
      <SunIcon />
    </IconButton>
    { /* color: av-color(alert); */ }
    <IconButton className={ styles.alertColor } variant="outline">
      <SunIcon />
    </IconButton>
    { /* color: av-color(error); */ }
    <IconButton className={ styles.errorColor } variant="ghost">
      <SunIcon />
    </IconButton>
  </div>
)

export const playGround = () => (
  <IconButton
    size={ select('size', ['small', 'large'], 'small') }
    variant={ select('variant', ['fill', 'outline', 'ghost'], 'fill') }
    disabled={ boolean('disabled', false) }
  >
    <SunIcon />
  </IconButton>
)
