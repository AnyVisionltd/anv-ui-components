import React from 'react'
import { select, boolean, text } from '@storybook/addon-knobs'
import { ReactComponent as SunIcon } from '../../assets/svg/Sun.svg'
import Button from './Button'
import styles from '../../styles/storybook/index.module.scss'
import { centerDecorator } from '../../utils/storybook/decorators'

export default {
  title: 'Button',
  component: Button,
  decorators: [centerDecorator],
}

export const Default = () => (
  <Button>
    Text
  </Button>
)

export const variants = () => (['fill', 'outline', 'ghost'].map((variant) => (
  <Button className={ styles.microMargin } key={ variant } variant={ variant }>
    { variant }
  </Button>
))
)

export const sizes = () => (
  <>
    <Button className={ styles.microMargin }>Large</Button>
    <Button className={ styles.microMargin } size="small">small</Button>
  </>
)


export const disable = () => (
  <>
    <Button className={ styles.microMargin }>Enable</Button>
    <Button className={ styles.microMargin } disabled>Disabled</Button>
  </>
)

export const withIcon = () => (
  <Button className={ styles.microMargin } startIcon={ <SunIcon /> }>
    Start
  </Button>
)

export const withClassName = () => (
  <div className={ styles.marginFlexContainer }>
    { /* background-color: av-color(success); */ }
    <Button className={ styles.successBackgroundColor }>
      Text
    </Button>
    { /* color: av-color(alert); */ }
    <Button className={ styles.alertColor } variant="outline">
      Text
    </Button>
    { /* color: av-color(error); */ }
    <Button className={ styles.errorColor } variant="ghost">
      Text
    </Button>
  </div>
)

export const playGround = () => (
  <Button
    size={ select('size', ['small', 'large'], 'large') }
    variant={ select('variant', ['fill', 'outline', 'ghost'], 'fill') }
    disabled={ boolean('disabled', false) }
  >
    { text('text', 'Button Text') }
  </Button>
)
