import React from 'react'
import { centerDecorator } from '../../utils/storybook/decorators'
import DateInput from './DateInput'

export default {
  title: 'User Inputs/Date & Time/DateInput',
  component: DateInput,
  decorators: [centerDecorator],
}

export const Basic = () => <DateInput />
