import React, { useState } from 'react'
import TimePicker from '.'
import { centerDecorator } from '../../utils/storybook/decorators'
import moment from 'moment'

export default {
  title: 'User Inputs/Date & Time/TimePicker',
  component: TimePicker,
  decorators: [centerDecorator],
}

export const Basic = () => {
  const [value, setValue] = useState(moment().format('HH:mm'))
  return (
    <div>
      <TimePicker onChange={setValue} />
      <p>Selected time: {value}</p>
    </div>
  )
}
