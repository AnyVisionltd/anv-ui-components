import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import moment from 'moment'
import TimePicker from './TimePicker'

describe('<TimePicker />', () => {
  it('Should render', () => {
    const { container } = render(<TimePicker />)
    expect(container).toBeTruthy()
  })

  it('Should be disabled', () => {
    const { getByRole } = render(<TimePicker disabled />)
    const node = getByRole('textbox')
    expect(node.disabled).toBe(true)
  })

  it('Should call onChange', () => {
    const handleOnChange = jest.fn()
    const { getByRole } = render(<TimePicker onChange={handleOnChange} />)
    const input = getByRole('textbox')
    fireEvent.change(input, { target: { value: new Date() } })
    expect(handleOnChange).toBeCalled()
    expect(input.value).toBe(moment().format('HH:mm'))
  })
})
