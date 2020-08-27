import React from 'react'
import { select, boolean, text } from '@storybook/addon-knobs'
import { ReactComponent as SunIcon } from '../../assets/svg/Sun.svg'
import Button from './Button'
import styles from '../../styles/storybook/index.module.scss'
import { centerDecorator } from '../../utils/storybook/decorators'

export default {
  title: 'Components/Button',
  component: Button,
  decorators: [centerDecorator],
}

export const Default = () => (
  <Button>
    Text
  </Button>
)

export const variants = () => (
  <div className={ styles.marginFlexContainer }>
    <Button>
      fill
    </Button>
    <Button variant="outline">
      outline
    </Button>
    <Button variant="ghost">
      ghost
    </Button>
  </div>
)

export const sizes = () => (
  <div className={ styles.marginFlexContainer }>
    <Button>Large</Button>
    <Button size="medium">medium</Button>
    <Button size="small">small</Button>
  </div>
)


export const disable = () => (
  <div className={ styles.marginFlexContainer }>
    <Button>Enable</Button>
    <Button disabled>Disabled</Button>
  </div>
)

export const withIcon = () => (
  <Button leadingIcon={ <SunIcon /> }>
    leading
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
    size={ select('size', ['small', 'medium', 'large'], 'large') }
    variant={ select('variant', ['fill', 'outline', 'ghost'], 'fill') }
    disabled={ boolean('disabled', false) }
  >
    { text('text', 'Button Text') }
  </Button>
)
