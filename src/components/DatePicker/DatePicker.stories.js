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
  const [value, setValue] = useState(moment().add(7, 'days'))
  return (
    <div>
      <DatePicker onChange={setValue} value={value} />
      <p>Selected date: {value.format('DD/MM/yyyy')}</p>
    </div>
  )
}
