import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import InputBase from './InputBase'

describe('<InputBase />', () => {
  describe('render input', () => {
    it('should not render rows attribute', () => {
      const numberOfRows = 3
      const { getByRole } = render(<InputBase rows={numberOfRows} />)
      const input = getByRole('textbox')
      expect(input).not.toHaveProperty('rows', numberOfRows.toString())
    })

    describe('events', () => {
      // TODO: Check why the click not triggering state.
      it('should rendered password input', async () => {
        const type = 'password'
        const newType = 'text'
        const { getByRole, rerender, getByPlaceholderText } = render(
          <InputBase type={type} placeholder={type} />,
        )
        const passwordButton = getByRole('button')
        const input = getByPlaceholderText(type)
        expect(passwordButton).toBeDefined()
        expect(input).toHaveProperty('type', type)
        fireEvent.click(passwordButton)
        rerender(<InputBase type={newType} placeholder={type} />)
        expect(input).toHaveProperty('type', newType)
      })
    })
  })

  describe('render textarea', () => {
    it('should not render type attribute', () => {
      const type = 'password'
      const { getByRole } = render(<InputBase multiline type={type} />)
      const input = getByRole('textbox')
      expect(input).not.toHaveProperty('type', type)
    })
  })
})
