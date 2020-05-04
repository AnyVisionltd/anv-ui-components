import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { getAllByRole } from '@testing-library/dom'
import { Switch } from './index'

describe('<Switch />', () => {
  describe('check click on switch functionality', () => {
    describe('normal switch', () => {
      describe('check input state change', () => {
        const { container } = render(<Switch />)
        const switchToggle = getAllByRole(container, 'checkbox', { hidden: true })

        it('should be changed from true to false after clicking on the switch', () => {
          expect(switchToggle).toHaveLength(1)
          expect(switchToggle[0].checked).toBe(true)
          fireEvent.click(switchToggle[0])
          expect(switchToggle[0].checked).toBe(false)
        })

        it('should be changed from false to true after clicking on the switch', () => {
          expect(switchToggle).toHaveLength(1)
          expect(switchToggle[0].checked).toBe(false)
          fireEvent.click(switchToggle[0])
          expect(switchToggle[0].checked).toBe(true)
        })
      })

      it('should trigger a change handler', async () => {
        const onChange = jest.fn()
        const { container } = render(<Switch onChange={ onChange } />)
        const switchToggle = getAllByRole(container, 'checkbox', { hidden: true })

        expect(switchToggle).toHaveLength(1)
        await userEvent.click(switchToggle[0])
        expect(onChange).toBeCalled()
      })
    })

    describe('disabled switch', () => {
      it('on switch should stay on, change event should not be triggered', async () => {
        const onChange = jest.fn()
        const { container } = render(<Switch disabled onChange={ onChange } />)
        const switchToggle = getAllByRole(container, 'checkbox', { hidden: true })

        expect(switchToggle).toHaveLength(1)
        expect(switchToggle[0].checked).toBe(true)
        await userEvent.click(switchToggle[0])
        expect(switchToggle[0].checked).toBe(true)
        expect(onChange).not.toBeCalled()
      })

      it('off switch should stay off, change event should not be triggered', async () => {
        const onChange = jest.fn()
        const { container } = render(<Switch checked={ false } disabled onChange={ onChange } />)
        const switchToggle = getAllByRole(container, 'checkbox', { hidden: true })

        expect(switchToggle).toHaveLength(1)
        expect(switchToggle[0].checked).toBe(false)
        await userEvent.click(switchToggle[0])
        expect(switchToggle[0].checked).toBe(false)
        expect(onChange).not.toBeCalled()
      })
    })
  })
})
