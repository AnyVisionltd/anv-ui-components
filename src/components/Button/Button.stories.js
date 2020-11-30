import React from 'react'
import { ReactComponent as SunIcon } from '../../assets/svg/Sun.svg'
import Button from './Button'
import styles from '../../storybook/index.module.scss'
import { centerDecorator } from '../../utils/storybook/decorators'

export default {
  title: 'User Inputs/Buttons/Button',
  component: Button,
  decorators: [centerDecorator],
}

export const Default = () => <Button>Text</Button>

export const variants = () => (
  <div className={styles.marginFlexContainer}>
    <Button>fill</Button>
    <Button variant='outline'>outline</Button>
    <Button variant='ghost'>ghost</Button>
  </div>
)

export const sizes = () => (
  <div className={styles.marginFlexContainer}>
    <Button size='large'>Large</Button>
    <Button>medium</Button>
    <Button size='small'>small</Button>
  </div>
)

export const disable = () => (
  <div className={styles.marginFlexContainer}>
    <Button>Enable</Button>
    <Button disabled>Disabled</Button>
  </div>
)

export const withIcon = () => <Button leadingIcon={<SunIcon />}>leading</Button>

export const withClassName = () => (
  <div className={styles.marginFlexContainer}>
    {/* background-color: av-color(success); */}
    <Button className={styles.successBackgroundColor}>Text</Button>
    {/* color: av-color(alert); */}
    <Button className={styles.alertColor} variant='outline'>
      Text
    </Button>
    {/* color: av-color(error); */}
    <Button className={styles.errorColor} variant='ghost'>
      Text
    </Button>
  </div>
)

export const PlayGround = args => <Button {...args} />
PlayGround.args = { children: 'Button Text' }
