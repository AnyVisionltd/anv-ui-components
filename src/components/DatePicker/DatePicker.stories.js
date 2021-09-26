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
  const defaultDate = new Date(Date.UTC(2021, 8, 23))
  const [value, setValue] = useState(moment(defaultDate).format('DD/MM/yyyy'))

  return (
    <div>
      <DatePicker onChange={setValue} defaultValue={defaultDate} />
      <p>Selected date: {value}</p>
    </div>
  )
}
