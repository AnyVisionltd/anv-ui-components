import React, { useState } from 'react'
import { select, boolean, text } from '@storybook/addon-knobs'
import styleGuideColors from '@anyvision/style-guide/abstracts/_colors.scss'
import Checkbox from './Checkbox'
import { centerDecorator } from '../../utils/storybook/decorators'
import styles from '../../styles/storybook/index.module.scss'

/* eslint react-hooks/rules-of-hooks: 0 */

export default {
  title: 'Checkbox',
  component: Checkbox,
  decorators: [centerDecorator],
}

const OverviewWithHooks = () => {
  const [isChecked, setChecked] = useState(false)
  const [isIndeterminate, setIndeterminate] = useState(false)
  const onChange = ({ target }) => {
    setChecked(target.checked)
    setIndeterminate(target.indeterminate)
  }

  return (
    <>
      <Checkbox
        indeterminate={ isIndeterminate }
        checked={ isChecked }
        onChange={ onChange }
        id="checkbox-playground"
      />
      <label htmlFor="checkbox-playground" className={ styles.checkboxLabel }>
        Check me out!
      </label>
    </>
  )
}
export const Overview = () => <OverviewWithHooks />

const ColorsWithHooks = () => Object
  .keys(styleGuideColors)
  .map((color) => {
    const [isChecked, setChecked] = useState(true)
    const onChange = ({ target }) => {
      setChecked(target.checked)
    }
    return (
      <Checkbox
        className={ styles.microMargin }
        key={ color }
        color={ color }
        checked={ isChecked }
        onChange={ onChange }
      />
    )
  })
export const Colors = () => <ColorsWithHooks />

export const states = () => (
  <>
    <Checkbox className={ styles.microMargin } checked />
    <Checkbox className={ styles.microMargin } />
    <Checkbox className={ styles.microMargin } indeterminate />
    <Checkbox className={ styles.microMargin } disabled />
  </>
)

export const playground = () => (
  <>
    <Checkbox
      color={ select('color', Object.keys(styleGuideColors), 'primary') }
      indeterminate={ boolean('indeterminate', false) }
      checked={ boolean('checked', false) }
      disabled={ boolean('disabled', false) }
      id="checkbox-playground"
    />
    <label htmlFor="checkbox-playground" className={ styles.checkboxLabel }>
      { text('Label text', 'Hit me!') }
    </label>
  </>
)
