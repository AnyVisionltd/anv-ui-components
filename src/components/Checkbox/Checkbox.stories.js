import React from 'react'
import { select, boolean } from '@storybook/addon-knobs'
import Checkbox from './Checkbox'
import { centerDecorator } from '../../utils/storybook/decorators'
import styleGuideColors from '@anyvision/style-guide/abstracts/_colors.scss'
import styles from '../../styles/storybook/index.module.scss'

export default {
  title: 'Checkbox',
  component: Checkbox,
  decorators: [centerDecorator],
}

export const Default = () => (
  <Checkbox/>
)

export const colors = () => (Object.keys(styleGuideColors).map((color) => (
  <Checkbox className={styles.microMargin} key={color} color={color} checked/>
)))

export const states = () => (
  <>
    <Checkbox className={styles.microMargin} checked/>
    <Checkbox className={styles.microMargin}/>
    <Checkbox className={styles.microMargin} indeterminate/>
    <Checkbox className={styles.microMargin} disabled/>
  </>
)

export const playGround = () => (
  <Checkbox
    color={select('color', Object.keys(styleGuideColors), 'primary')}
    indeterminate={boolean('indeterminate', false)}
    checked={boolean('checked', false)}
    disabled={boolean('disabled', false)}
  />
)
