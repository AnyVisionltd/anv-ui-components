import React from 'react'
import { text } from '@storybook/addon-knobs'
import InputBase from './InputBase'
import { ReactComponent as SunIcon } from '../../assets/svg/Sun.svg'
import { centerDecorator } from '../../utils/storybook/decorators'
import styles from '../../styles/storybook/index.module.scss'

export default {
  title: 'Components/InputBase',
  component: InputBase,
  decorators: [centerDecorator],
}

export const Default = () => <InputBase placeholder="Placeholder" />

export const sizes = () => (
  <div className={ styles.marginFlexContainer }>
    <InputBase placeholder="Large Size" />
    <InputBase size="small" placeholder="Small Size" />
  </div>
)

export const disable = () => (
  <div className={ styles.marginFlexContainer }>
    <InputBase placeholder="Enabled" />
    <InputBase disabled placeholder="Disabled" />
  </div>
)

export const withIcon = () => <InputBase leadingIcon={ <SunIcon /> } placeholder="With Icon" />

export const withLastIcon = () => <InputBase lastIcon={ <SunIcon /> } placeholder="With Last Icon" />

export const states = () => (
  <>
    <InputBase type="password" placeholder="Password" />
    <InputBase type="number" placeholder="number" />
    <InputBase multiline placeholder="Multiline" />
    <InputBase multiline resize placeholder="Multiline Resize" />
  </>
)

export const playground = () => (
  <>
    <InputBase />
    <label htmlFor="checkbox-playground">
      { text('Label text', 'Hit me!') }
    </label>
  </>
)
