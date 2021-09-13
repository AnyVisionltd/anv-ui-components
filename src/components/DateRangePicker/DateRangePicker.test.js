import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import moment from 'moment'
import DateRangePicker from './DateRangePicker'

describe('<DateRangePicker />', () => {
  it('Should render', () => {
    const { container } = render(<DateRangePicker />)
    expect(container).toBeTruthy()
  })
})
