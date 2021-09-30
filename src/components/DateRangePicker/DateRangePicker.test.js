import React from 'react'
import { render } from '@testing-library/react'
import DateRangePicker from './DateRangePicker'

describe('<DateRangePicker />', () => {
  it('Should render', () => {
    const { container } = render(<DateRangePicker />)
    expect(container).toBeTruthy()
  })
})
