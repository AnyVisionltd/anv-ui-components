import React, { useState } from 'react'
import { boolean, number, select } from '@storybook/addon-knobs'
import { InputBase, IconButton } from '../../index'
import { ReactComponent as SunIcon } from '../../assets/svg/Sun.svg'
import { centerDecorator } from '../../utils/storybook/decorators'
import styles from '../../storybook/index.module.scss'

export default {
  title: 'User Inputs/InputBase',
  component: InputBase.type,
  decorators: [centerDecorator],
}

export const Default = () => <InputBase placeholder='Placeholder' />

export const Disable = () => (
  <div className={styles.flexMultipleRows}>
    <InputBase placeholder='Enabled' />
    <InputBase disabled placeholder='Disabled' />
  </div>
)

export const WithIcon = () => (
  <div className={styles.flexMultipleRows}>
    <InputBase leadingIcon={<SunIcon />} placeholder='With Icon' />
    <InputBase multiline leadingIcon={<SunIcon />} placeholder='With Icon' />
  </div>
)

export const WithtrailingIcon = () => (
  <div className={styles.flexMultipleRows}>
    <InputBase
      trailingIcon={
        <IconButton variant='ghost'>
          <SunIcon />
        </IconButton>
      }
      placeholder='With Last Icon'
    />
    <InputBase
      multiline
      trailingIcon={
        <IconButton variant='ghost'>
          <SunIcon />
        </IconButton>
      }
      placeholder='With Last Icon'
    />
  </div>
)

export const States = () => (
  <div className={styles.flexMultipleRows}>
    <InputBase readOnly placeholder='readOnly' defaultValue='default value' />
    <InputBase defaultValue='Default Value' />
    <InputBase type='password' placeholder='Password' />
    <InputBase type='number' placeholder='number' />
    <InputBase multiline placeholder='Multiline' />
    <InputBase multiline rows={10} placeholder='Multiline 10 Rows' />
  </div>
)

export const WithClearTextIcon = () => {
  const [value, setValue] = useState('')
  return (
    <InputBase
      value={value}
      onChange={e => setValue(e.target.value)}
      useClearTextIcon
      placeholder='With Clear Text Icon'
    />
  )
}

export const Playground = () => {
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
        onChange={() => {}}
        multiline={boolean('multiline', false)}
        disabled={boolean('disabled', false)}
        readOnly={boolean('read-only', false)}
        {...inputProps}
        {...multilineProps}
      />
    </>
  )
}
