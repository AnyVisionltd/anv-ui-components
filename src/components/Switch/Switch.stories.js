import React, { useState } from 'react'
import { boolean, text } from '@storybook/addon-knobs'
import Switch from './Switch'
import styles from '../../styles/storybook/index.module.scss'
import { centerDecorator } from '../../utils/storybook/decorators'

export default {
  title: 'Components/Switch',
  component: Switch,
  decorators: [centerDecorator],
}

export const Default = () => {
  const [isEnabled, setIsEnabled] = useState(true)

  const onChange = ({ target }) => {
    setIsEnabled(target.checked)
  }
  return (
    <div className={ styles.marginFlexContainer }>
      <Switch
        checked={ isEnabled }
        onChange={ onChange }
        id="switch-example"
      />
      <label htmlFor="switch-example">
        Check me out!
      </label>
    </div>
  )
}

export const MultipleSwitches = () => {
  const [isEnabled1, setIsEnabled1] = useState(false)
  const [isEnabled2, setIsEnabled2] = useState(true)
  const [isEnabled3, setIsEnabled3] = useState(false)
  const [isEnabled4, setIsEnabled4] = useState(true)

  const onChange = ({ target }, updateFunc) => {
    updateFunc(target.checked)
  }

  return (
    <div className={ styles.marginFlexContainer }>
      <Switch
        checked={ isEnabled1 }
        onChange={ (value) => onChange(value, setIsEnabled1) }
        id="switch-example1"
      />
      <Switch
        checked={ isEnabled2 }
        onChange={ (value) => onChange(value, setIsEnabled2) }
        id="switch-example2"
      />
      <Switch
        checked={ isEnabled3 }
        disabled
        onChange={ (value) => onChange(value, setIsEnabled3) }
        id="switch-example3"
      />
      <Switch
        checked={ isEnabled4 }
        disabled
        onChange={ (value) => onChange(value, setIsEnabled4) }
        id="switch-example4"
      />
    </div>
  )
}

export const playground = () => (
  <div className={ styles.marginFlexContainer }>
    <Switch
      checked={ boolean('checked', false) }
      disabled={ boolean('disabled', false) }
      id="switch-playground"
    />
    <label htmlFor="switch-playground">
      { text('Label text', 'Hit me!') }
    </label>
  </div>
)
