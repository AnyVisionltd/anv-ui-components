import React from 'react'
import { centerDecorator } from '../../utils/storybook/decorators'
import DateTimePicker from './DateTimePicker'

export default {
  title: 'User Inputs/Date & Time/DateTimePicker',
  component: DateTimePicker,
  decorators: [centerDecorator],
}

export const Basic = () => <DateTimePicker disableFuture />
