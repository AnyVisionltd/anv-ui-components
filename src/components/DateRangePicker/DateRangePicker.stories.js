import React, { useState } from 'react'
import DateRangePicker from './DateRangePicker'
import { centerDecorator } from '../../utils/storybook/decorators'
import moment from 'moment'

export default {
  title: 'User Inputs/Date & Time/DateRangePicker',
  component: DateRangePicker,
  decorators: [centerDecorator],
}

export const Basic = () => {
  const [range, setRange] = useState({
    start: moment(),
    end: moment().add(1, 'days'),
  })

  return (
    <div>
      <DateRangePicker
        start={range.start}
        end={range.end}
        onChange={setRange}
      />
      <p style={{ textAlign: 'center' }}>
        Selected range: {range.start?.format('DD/MM/yyyy')} -{' '}
        {range.end?.format('DD/MM/yyyy')}
      </p>
    </div>
  )
}
