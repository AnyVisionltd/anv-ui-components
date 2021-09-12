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
  const [value, setValue] = useState(moment())
  return (
    <div>
      <TimePicker onChange={setValue} value={value} disabled />
      <p>Selected time: {value.format('HH:mm')}</p>
    </div>
  )
}
