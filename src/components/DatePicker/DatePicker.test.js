import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import moment from 'moment'
import DatePicker from './DatePicker'

describe('<DatePicker />', () => {
  it('Should render', () => {
    const { container } = render(<DatePicker />)
    expect(container).toBeTruthy()
  })

  it('Should be disabled', () => {
    const { getByRole } = render(<DatePicker disabled />)
    const node = getByRole('textbox')
    expect(node.disabled).toBe(true)
  })

  it('Should call onChange', () => {
    const mockDate = '01/01/2021'
    const handleOnChange = jest.fn()
    const { getByRole } = render(<DatePicker onChange={handleOnChange} />)
    const input = getByRole('textbox')
    fireEvent.change(input, { target: { value: mockDate } })
    expect(handleOnChange).toBeCalled()
    expect(input.value).toBe(mockDate)
  })
})
