import React, { useState } from 'react'
import DatePicker from '.'
import { centerDecorator } from '../../utils/storybook/decorators'
import moment from 'moment'

export default {
  title: 'User Inputs/Date & Time/DatePicker',
  component: DatePicker,
  decorators: [centerDecorator],
}

export const Basic = () => {
  const [value, setValue] = useState(moment().format('DD/MM/yyyy'))
  return (
    <div>
      <DatePicker onDateChange={setValue} />
      <p>Selected date: {JSON.stringify(value)}</p>
    </div>
  )
}
