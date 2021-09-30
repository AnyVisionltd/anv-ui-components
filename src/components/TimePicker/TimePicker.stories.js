import React from 'react'
import { centerDecorator } from '../../utils/storybook/decorators'
import TimePicker from './TimePicker'

export default {
  title: 'User Inputs/Date & Time/TimePicker',
  component: TimePicker,
  decorators: [centerDecorator],
}

export const Basic = () => <TimePicker />
