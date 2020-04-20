import React from 'react'
import { select, boolean, text } from '@storybook/addon-knobs'
import styleGuideColors from '@anyvision/style-guide/abstracts/_colors.scss'
import { ReactComponent as SunIcon } from '../../assets/svg/Sun.svg'
import Checkbox from './Checkbox'
import styles from '../../styles/storybook/index.module.scss'
import { centerDecorator } from '../../utils/storybook/decorators'

export default {
  title: 'Checkbox',
  component: Checkbox,
  decorators: [centerDecorator],
}

export const Default = () => (
  <Checkbox>
    Check me!
  </Checkbox>
)

export const colors = () => (Object.keys(styleGuideColors).map((color) => (
  <Checkbox className={ styles.microMargin } key={ color } color={ color }>
    { color }
  </Checkbox>
))
)

export const disable = () => (
  <>
    <Checkbox className={ styles.microMargin }>Enable</Checkbox>
    <Checkbox className={ styles.microMargin } disabled>Disabled</Checkbox>
  </>
)

export const states = () => (
  <>
    <Checkbox className={ styles.microMargin } checked>Checked</Checkbox>
    <Checkbox className={ styles.microMargin }>Not checked</Checkbox>
    <Checkbox className={ styles.microMargin } indeterminate>Indeterminate</Checkbox>
  </>
)

export const playGround = () => (
  <Checkbox
    color={ select('color', Object.keys(styleGuideColors), 'primary') }
    checked={ boolean('checked', false) }
    indeterminate={ boolean('indeterminate', false) }
    disabled={ boolean('disabled', false) }
  >
    { text('text', 'Checkbox Text') }
  </Checkbox>
)
