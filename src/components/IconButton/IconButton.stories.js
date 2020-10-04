import React from 'react'
import { select, boolean } from '@storybook/addon-knobs'
import { SunBrightens } from '@anyvision/anv-icons'
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
    <SunBrightens />
  </IconButton>
)

export const variants = () => (
  <div className={ styles.marginFlexContainer }>
    <IconButton>
      <SunBrightens />
    </IconButton>
    <IconButton variant="outline">
      <SunBrightens />
    </IconButton>
    <IconButton variant="ghost">
      <SunBrightens />
    </IconButton>
  </div>
)

export const sizes = () => (
  <div className={ styles.marginFlexContainer }>
    <IconButton><SunBrightens /></IconButton>
    <IconButton size="medium"><SunBrightens /></IconButton>
    <IconButton size="large"><SunBrightens /></IconButton>
  </div>
)


export const disable = () => (
  <div className={ styles.marginFlexContainer }>
    <IconButton><SunBrightens /></IconButton>
    <IconButton disabled><SunBrightens /></IconButton>
  </div>
)

export const withClassName = () => (
  <div className={ styles.marginFlexContainer }>
    { /* background-color: av-color(success); */ }
    <IconButton className={ styles.successBackgroundColor }>
      <SunBrightens />
    </IconButton>
    { /* color: av-color(alert); */ }
    <IconButton className={ styles.alertColor } variant="outline">
      <SunBrightens />
    </IconButton>
    { /* color: av-color(error); */ }
    <IconButton className={ styles.errorColor } variant="ghost">
      <SunBrightens />
    </IconButton>
  </div>
)

export const playGround = () => (
  <IconButton
    size={ select('size', ['small', 'medium', 'large'], 'small') }
    variant={ select('variant', ['fill', 'outline', 'ghost'], 'fill') }
    disabled={ boolean('disabled', false) }
  >
    <SunBrightens />
  </IconButton>
)
