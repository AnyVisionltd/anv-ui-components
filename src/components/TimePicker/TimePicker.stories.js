import React from 'react'
import TimePicker from './TimePicker'
import { centerDecorator } from '../../utils/storybook/decorators'

export default {
  title: 'User Inputs/Date & Time/TimePicker',
  component: TimePicker,
  decorators: [centerDecorator],
}

export const Basic = () => <TimePicker />
