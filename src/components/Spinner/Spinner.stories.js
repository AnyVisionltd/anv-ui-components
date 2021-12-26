import React from 'react'
import Spinner from './Spinner'
import styles from '../../storybook/index.module.scss'
import { centerDecorator } from '../../utils/storybook/decorators'

export default {
  title: 'User Feedback/Spinner',
  component: Spinner,
  decorators: [centerDecorator],
}

export const Default = () => (
  <div className={styles.spinnerBg}>
    <Spinner />
  </div>
)

export const size = () => (
  <div className={styles.spinnerBg}>
    <Spinner /> small
    <Spinner size='medium' /> medium
    <Spinner size='large' /> large
    <Spinner size='giant' /> giant
  </div>
)

export const PlayGround = args => (
  <div className={styles.spinnerBg}>
    <Spinner {...args} />
  </div>
)
PlayGround.args = { children: 'Spinner Text' }
