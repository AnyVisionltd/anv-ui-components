import React from 'react'
import { boolean, select } from '@storybook/addon-knobs'
import InputBase from './InputBase'
import { IconButton } from '../IconButton'
import { ReactComponent as SunIcon } from '../../assets/svg/Sun.svg'
import { centerDecorator } from '../../utils/storybook/decorators'
import styles from '../../styles/storybook/index.module.scss'

export default {
  title: 'Components/InputBase',
  component: InputBase,
  decorators: [centerDecorator],
}

export const Default = () => <InputBase placeholder="Placeholder" />

export const disable = () => (
  <div className={ styles.flexMultipleRows }>
    <InputBase placeholder="Enabled" />
    <InputBase disabled placeholder="Disabled" />
  </div>
)

export const withIcon = () => <InputBase leadingIcon={ <SunIcon /> } placeholder="With Icon" />

export const withTrailingComponent = () => (
  <InputBase
    trailingComponent={ <IconButton variant="ghost"><SunIcon /></IconButton> }
    placeholder="With Last Icon"
  />
)

export const states = () => (
  <div className={ styles.flexMultipleRows }>
    <InputBase readOnly placeholder="readOnly" />
    <InputBase type="password" placeholder="Password" />
    <InputBase type="number" placeholder="number" />
    <InputBase multiline placeholder="Multiline" />
    <InputBase multiline resize placeholder="Multiline Resize" />
    <InputBase multiline rows={ 10 } placeholder="Multiline 10 Rows" />
  </div>
)

export const playground = () => (
  <>
    <InputBase
      disabled={ boolean('disabled', false) }
      type={ select('type', ['number', 'password', 'text'], 'text') }
    />
  </>
)
