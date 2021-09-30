import React from 'react'
import moment from 'moment'
import { render, fireEvent } from '@testing-library/react'
import DateTimePicker from './DateTimePicker'

describe('<DateTimePicker />', () => {
  it('Should render', () => {
    const { container } = render(<DateTimePicker />)
    expect(container).toBeTruthy()
  })

  it('Should be disabled', () => {
    const { getByRole } = render(<DateTimePicker disabled />)
    const node = getByRole('textbox')
    expect(node.disabled).toBe(true)
  })

  it('Should call onChange', () => {
    const handleOnChange = jest.fn()
    const { getByRole } = render(<DateTimePicker onChange={handleOnChange} />)
    const input = getByRole('textbox')
    fireEvent.change(input, { target: { value: moment() } })
    expect(handleOnChange).toBeCalled()
    expect(input.value).toBe(moment().format('DD/MM/yyyy HH:mm'))
  })
})
