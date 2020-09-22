import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { ReactComponent as SvgIcon } from '../../../jest/assets/svgIcon.svg'
import TextField from './TextField'

describe('<TextField />', () => {

  it('should render leadingIcon', () => {
    const { container } = render(<TextField leadingIcon={ <SvgIcon /> } />)
    const node = container.querySelector('svg')
    expect(node).toBeTruthy()
  })

  it('should render trailingIcon', () => {
    const { container } = render(<TextField trailingIcon={ <SvgIcon /> } />)
    const node = container.querySelector('svg')
    expect(node).toBeTruthy()
  })

  describe('disabled', () => {
    it('should NOT be disabled by default', () => {
      const { getByRole } = render(<TextField />)
      const node = getByRole('textbox')
      expect(node.disabled).toBe(false)
    })

    it('should be disabled when disabled pass', () => {
      const { getByRole } = render(<TextField disabled />)
      const node = getByRole('textbox')
      expect(node).toBeDisabled()
    })
  })

  it('should have message', () => {
    const { getByText } = render(<TextField message={ 'message' } />)
    const node = getByText('message')
    expect(node).toBeTruthy()
  })

  it('should have placeholder', () => {
    const { getByPlaceholderText } = render(<TextField placeholder={ 'my placeholder' } />)
    const node = getByPlaceholderText('my placeholder')
    expect(node).toBeTruthy()
  })

  it('should have label', () => {
    const { getByText } = render(<TextField label={ 'my label' } />)
    const node = getByText('my label')
    expect(node).toBeTruthy()
  })

  it('should call onClick', () => {
    const handleClick = jest.fn()
    const { getByRole } = render(
      <TextField onClick={ handleClick } />,
    )
    const node = getByRole('textbox')
    fireEvent.click(node)
    expect(handleClick).toBeCalled()
  })

  it('should call onChange', () => {
    const handleOnChange = jest.fn()
    const { getByRole } = render(
      <TextField onChange={ handleOnChange } />,
    )
    const input = getByRole('textbox')
    fireEvent.change(input, { target: { value: 'I love dogs' } })
    expect(handleOnChange).toBeCalled()
    expect(input.value).toBe('I love dogs')
  })

  describe('type options', () => {
    const items = [{ value: 'Olives', label: 'Olives' }, { value: 'Tomatoes', label: 'Tomatoes' }]

    it('should call onMenuItemClick', () => {
      const handleClick = jest.fn()
      const { getByDisplayValue, getByText } = render(<TextField defaultValue={ 'Tomatoes' } onChange={ handleClick } items={ items } type={ 'options' }/>)
      const input = getByDisplayValue('Tomatoes')
      fireEvent.click(input)
      const node = getByText('Olives')
      expect(node).toBeTruthy()
      fireEvent.click(node)
      expect(handleClick).toBeCalled()
    })
  })
})
