import React, { useState } from 'react'
import DateRangePicker from '.'
import { centerDecorator } from '../../utils/storybook/decorators'
import moment from 'moment'

export default {
  title: 'User Inputs/Date & Time/DateRangePicker',
  component: DateRangePicker,
  decorators: [centerDecorator],
}

export const Basic = () => {
  const [range, setRange] = useState({
    startDate: null,
    endDate: null,
  })
  return (
    <div style={{ textAlign: 'center' }}>
      <DateRangePicker
        start={range.startDate}
        end={range.endDate}
        onChange={setRange}
      />
      <p>
        Selected range: {range.startDate?.format('DD/MM/yyyy')} -{' '}
        {range.endDate?.format('DD/MM/yyyy')}
      </p>
    </div>
  )
}
