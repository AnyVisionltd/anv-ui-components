import React from 'react'
import {
  boolean, number, select, text,
} from '@storybook/addon-knobs'
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

export const withIcon = () => (
  <div className={ styles.flexMultipleRows }>
    <InputBase leadingIcon={ <SunIcon /> } placeholder="With Icon" />
    <InputBase multiline leadingIcon={ <SunIcon /> } placeholder="With Icon" />
  </div>
)

export const withTrailingComponent = () => (
  <div className={ styles.flexMultipleRows }>
    <InputBase
      trailingComponent={ <IconButton variant="ghost"><SunIcon /></IconButton> }
      placeholder="With Last Icon"
    />
    <InputBase
      multiline
      trailingComponent={ <IconButton variant="ghost"><SunIcon /></IconButton> }
      placeholder="With Last Icon"
    />
  </div>
)

export const states = () => (
  <div className={ styles.flexMultipleRows }>
    <InputBase readOnly placeholder="readOnly" defaultValue="default value" />
    <InputBase defaultValue="Default Value" />
    <InputBase type="password" placeholder="Password" />
    <InputBase type="number" placeholder="number" />
    <InputBase multiline placeholder="Multiline" />
    <InputBase multiline rows={ 10 } placeholder="Multiline 10 Rows" />
  </div>
)

export const inputPlayground = () => {
  const isMultiline = boolean('multiline', false)
  const multilineProps = isMultiline && {
    rows: number('rows', 3),
  }
  const inputProps = !isMultiline && {
    type: select('type', ['number', 'password', 'text'], 'text'),
  }
  return (
    <>
      <InputBase
        value={ text('value', '') }
        onChange={ () => {} }
        multiline={ boolean('multiline', false) }
        disabled={ boolean('disabled', false) }
        readOnly={ boolean('read-only', false) }
        { ...inputProps }
        { ...multilineProps }
      />
    </>
  )
}
