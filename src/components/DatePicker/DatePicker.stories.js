import React from 'react'
import DatePicker from '.'
import { centerDecorator } from '../../utils/storybook/decorators'
import moment from 'moment'

export default {
  title: 'User Inputs/Date & Time/DatePicker',
  component: DatePicker,
  decorators: [centerDecorator],
}

console.log(moment().add(1, 'days'))
export const Basic = () => {
  return (
    <div>
      <DatePicker />
    </div>
  )
}
