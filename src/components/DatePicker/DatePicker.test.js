import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import moment from 'moment'
import DatePicker from './DatePicker'

describe('<DatePicker />', () => {
  it('Should render', () => {
    const { container } = render(<DatePicker />)
    expect(container).toBeTruthy()
  })

  it('Should call onChange', () => {
    const handleOnChange = jest.fn()
    const { getByRole } = render(<DatePicker onChange={handleOnChange} />)
    const input = getByRole('textbox')
    fireEvent.change(input, { target: { value: new Date('2021-09-23') } })
    expect(handleOnChange).toBeCalled()
    expect(input.value).toBe(moment().format('DD/MM/yyyy'))
  })
})
