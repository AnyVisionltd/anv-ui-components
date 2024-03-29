import React from 'react'
import DatePicker from './DatePicker'
import { centerDecorator } from '../../utils/storybook/decorators'

export default {
  title: 'User Inputs/Date & Time/DatePicker',
  component: DatePicker,
  decorators: [centerDecorator],
}

export const Basic = () => <DatePicker />
