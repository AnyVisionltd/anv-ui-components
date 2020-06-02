import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Switch } from './index'

describe('<Switch />', () => {
  describe('check click on switch functionality', () => {
    describe('normal switch', () => {
      describe('check input state change', () => {
        const { getByRole } = render(<Switch />)
        const switchToggle = getByRole('checkbox', { hidden: true })

        it('should be changed from true to false after clicking on the switch', () => {
          expect(switchToggle.checked).toBe(true)
          fireEvent.click(switchToggle)
          expect(switchToggle.checked).toBe(false)
        })

        it('should be changed from false to true after clicking on the switch', () => {
          expect(switchToggle.checked).toBe(false)
          fireEvent.click(switchToggle)
          expect(switchToggle.checked).toBe(true)
        })
      })

      it('should trigger a change handler', async () => {
        const onChange = jest.fn()
        const { getByRole } = render(<Switch onChange={ onChange } />)
        const switchToggle = getByRole('checkbox', { hidden: true })

        await userEvent.click(switchToggle)
        expect(onChange).toBeCalled()
      })
    })

    describe('disabled switch', () => {
      it('on switch should stay on, change event should not be triggered', async () => {
        const onChange = jest.fn()
        const { getByRole } = render(<Switch disabled onChange={ onChange } />)
        const switchToggle = getByRole('checkbox', { hidden: true })

        expect(switchToggle.checked).toBe(true)
        await userEvent.click(switchToggle)
        expect(switchToggle.checked).toBe(true)
        expect(onChange).not.toBeCalled()
      })

      it('off switch should stay off, change event should not be triggered', async () => {
        const onChange = jest.fn()
        const { getByRole } = render(<Switch checked={ false } disabled onChange={ onChange } />)
        const switchToggle = getByRole('checkbox', { hidden: true })

        expect(switchToggle.checked).toBe(false)
        await userEvent.click(switchToggle)
        expect(switchToggle.checked).toBe(false)
        expect(onChange).not.toBeCalled()
      })
    })
  })
})
