import React from 'react'
import { centerDecorator } from '../../utils/storybook/decorators'
import DateRangeInput from './DateRangeInput'

export default {
  title: 'User Inputs/Date & Time/DateRangeInput',
  component: DateRangeInput,
  decorators: [centerDecorator],
}

export const Basic = () => <DateRangeInput />
