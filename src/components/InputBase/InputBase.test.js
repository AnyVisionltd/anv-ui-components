import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import InputBase from './InputBase'
import { ReactComponent as SunIcon } from '../../assets/svg/Sun.svg'

describe('<InputBase />', () => {
  describe('common input logic', () => {
    it('should have placeholder attribute', () => {
      const defaultPlaceholder = 'placeHolder'
      const { getByRole } = render(<InputBase placeholder={ defaultPlaceholder } />)
      const input = getByRole('textbox')
      expect(input).toHaveAttribute('placeholder', defaultPlaceholder)
    })

    it('should have disabled attribute', () => {
      const value = 'should not display value'
      const { getByRole } = render(<InputBase disabled />)
      const input = getByRole('textbox')
      userEvent.type(input, value)
      expect(input).toHaveAttribute('disabled')
      expect(input.value).not.toBe(value)
    })

    it('should render leading icon', () => {
      const { getByRole, container } = render(<InputBase leadingIcon={ <SunIcon /> } />)
      const svg = container.querySelector('svg')
      const input = getByRole('textbox')
      expect(svg).toBeDefined()
      expect(input).toBeDefined()
    })

    it('should render trailing component', () => {
      const { getByRole, container } = render(<InputBase trailingComponent={ <SunIcon /> } />)
      const svg = container.querySelector('svg')
      const input = getByRole('textbox')
      expect(svg).toBeDefined()
      expect(input).toBeDefined()
    })

    describe('events', () => {
      it('should change value', () => {
        const value = 'new value'
        const { getByRole } = render(<InputBase />)
        const input = getByRole('textbox')
        fireEvent.change(input, { target: { value } })
        expect(input.value).toBe(value)
      })
    })
  })

  describe('render input', () => {
    it('should render input', () => {
      const { getByRole } = render(<InputBase />)
      const input = getByRole('textbox')
      expect(input).toBeDefined()
    })

    it('should not render rows attribute', () => {
      const numberOfRows = 3
      const { getByRole } = render(<InputBase rows={ numberOfRows } />)
      const input = getByRole('textbox')
      expect(input).not.toHaveProperty('rows', numberOfRows.toString())
    })

    describe('events', () => {
      // TODO: Check why the click not triggering state.
      it('should rendered password input', async () => {
        const type = 'password'
        const newType = 'text'
        const {
          getByRole,
          rerender,
          getByPlaceholderText,
        } = render(<InputBase type={ type } placeholder={ type } />)
        const passwordButton = getByRole('button')
        const input = getByPlaceholderText(type)
        expect(passwordButton).toBeDefined()
        expect(input).toHaveProperty('type', type)
        fireEvent.click(passwordButton)
        rerender(<InputBase type={ newType } placeholder={ type } />)
        expect(input).toHaveProperty('type', newType)
      })
    })
  })

  describe('render textarea', () => {
    it('should render textarea', () => {
      const numberOfRows = 3
      const { getByRole } = render(<InputBase multiline rows={ numberOfRows } />)
      const input = getByRole('textbox')
      expect(input).toHaveAttribute('rows', numberOfRows.toString())
    })

    it('should not render type attribute', () => {
      const type = 'password'
      const { getByRole } = render(<InputBase multiline type={ type } />)
      const input = getByRole('textbox')
      expect(input).not.toHaveProperty('type', type)
    })
  })
})
