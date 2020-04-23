import React from 'react'
import { select, boolean } from '@storybook/addon-knobs'
import { ReactComponent as SunIcon } from '../../assets/svg/Sun.svg'
import IconButton from './IconButton'
import styles from '../../styles/storybook/index.module.scss'
import { centerDecorator } from '../../utils/storybook/decorators'

export default {
  title: 'IconButton',
  component: IconButton,
  decorators: [centerDecorator],
}

export const Default = () => (
  <IconButton>
    <SunIcon />
  </IconButton>
)

export const variants = () => (['fill', 'outline', 'ghost'].map((variant) => (
  <IconButton className={ styles.microMargin } key={ variant } variant={ variant }>
    <SunIcon />
  </IconButton>
))
)

export const sizes = () => (
  <>
    <IconButton className={ styles.microMargin }><SunIcon /></IconButton>
    <IconButton className={ styles.microMargin } size="large"><SunIcon /></IconButton>
  </>
)


export const disable = () => (
  <>
    <IconButton className={ styles.microMargin }><SunIcon /></IconButton>
    <IconButton className={ styles.microMargin } disabled><SunIcon /></IconButton>
  </>
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
