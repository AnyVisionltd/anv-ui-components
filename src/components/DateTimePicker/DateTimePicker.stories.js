import React, { useState } from 'react'
import DateTimePicker from '.'
import { centerDecorator } from '../../utils/storybook/decorators'
import moment from 'moment'

export default {
  title: 'User Inputs/Date & Time/DateTimePicker',
  component: DateTimePicker,
  decorators: [centerDecorator],
}

export const Basic = () => {
  const [value, setValue] = useState(moment())
  return (
    <div>
      <DateTimePicker onChange={setValue} value={value} />
      <p>Selected time: {value.format('DD/MM/yyyy HH:mm')}</p>
    </div>
  )
}
