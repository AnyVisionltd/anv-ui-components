import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import userEvent from "@testing-library/user-event"
import { getByRole } from "@testing-library/dom"
import { Radio } from './index'

describe('<Radio />', () => {
  describe('input state behaviour', () => {
    describe('checked state', () => {
      it('should be checked when set to be', () => {
        const { container } = render(<Radio checked />)
        const radio = getByRole(container, 'radio')
        expect(radio.checked).toBe(true)
      })

      it('shouldn\'t be checked when not set to be', () => {
        const { container } = render(<Radio/>)
        const radio = getByRole(container, 'radio')
        expect(radio.checked).toBe(false)
      })
    })

    describe('disabled state', () => {
      it('should be disabled when set to be', () => {
        const { container } = render (<Radio disabled={ true }/>)
        const radio = getByRole(container, 'radio')
        expect(radio.disabled).toBe(true)
      })

      it('should not be disabled when set to be', () => {
        const { container } = render (<Radio/>)
        const radio = getByRole(container, 'radio')
        expect(radio.disabled).toBe(false)
      })
    })
  })

  describe('check click on radio functionality', () => {
    describe('normal radio', () => {
      describe('check input state change when unselected', () => {
        const { container } = render(<Radio/>)
        const radio = getByRole(container, 'radio')

        it('should be changed from false to true after being clicked', () => {
          expect(radio.checked).toBe(false)
          fireEvent.click(radio)
          expect(radio.checked).toBe(true)
        })

        it('should trigger a changed handler', async () => {
          const onChange = jest.fn()
          const { container } = render(<Radio onChange={ onChange }/>)
          const radio = getByRole(container, 'radio')

          await userEvent.click(radio)
          expect(onChange).toBeCalled()
        })
      })
      describe('check input state change when selected', () => {
        const { container } = render(<Radio checked/>)
        const radio = getByRole(container, 'radio')

        it('should be unchanged if already checked', () => {
          expect(radio.checked).toBe(true)
          fireEvent.click(radio)
          expect(radio.checked).toBe(true)
        })
      })
    })

    describe('disabled radio', () => {
      it('unchecked input should stay unchecked, change event should not be triggered', async () => {
        const onChange = jest.fn()
        const { container } = render(<Radio disabled onChange={ onChange }/>)
        const radio = getByRole(container, 'radio')

        expect(radio.checked).toBe(false)
        await userEvent.click(radio)
        expect(radio.checked).toBe(false)
        expect(onChange).not.toBeCalled()
      })

      it('checked input should stay unchecked, change event should not be triggered', async () => {
        const onChange = jest.fn()
        const { container } = render(<Radio checked disabled onChange={ onChange }/>)
        const radio = getByRole(container, 'radio')

        expect(radio.checked).toBe(true)
        await userEvent.click(radio)
        expect(radio.checked).toBe(true)
        expect(onChange).not.toBeCalled()
      })
    })
  })
})