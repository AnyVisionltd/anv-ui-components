import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { getByRole } from '@testing-library/dom'
import { Checkbox } from './index'

describe('<Checkbox />', () => {
	describe('input state behaviour', () => {
		describe('checked state', () => {
			it('should be checked when set to be', () => {
				const { container } = render(<Checkbox checked />)
				const checkbox = getByRole(container, 'checkbox')
				expect(checkbox.checked).toBe(true)
			})

			it('shouldn\'t be checked when not set to be', () => {
				const { container } = render(<Checkbox />)
				const checkbox = getByRole(container, 'checkbox')
				expect(checkbox.checked).toBe(false)
			})
		})

		describe('indeterminate view state', () => {
			it('should be indeterminate when set to be', () => {
				const { container } = render(<Checkbox indeterminate />)
				const checkbox = getByRole(container, 'checkbox')
				expect(checkbox.indeterminate).toBe(true)
			})

			it('shouldn\'t be indeterminate when not set to be', () => {
				const { container } = render(<Checkbox />)
				const checkbox = getByRole(container, 'checkbox')
				expect(checkbox.indeterminate).toBe(false)
			})
		})

		describe('disabled state', () => {
			it('should be disabled when set to be', () => {
				const { container } = render(<Checkbox disabled />)
				const checkbox = getByRole(container, 'checkbox')
				expect(checkbox.disabled).toBe(true)
			})

			it('shouldn\'t be disabled when not set to be', () => {
				const { container } = render(<Checkbox />)
				const checkbox = getByRole(container, 'checkbox')
				expect(checkbox.disabled).toBe(false)
			})
		})
	})

	describe('check click on checkbox functionality', () => {
		describe('normal checkbox', () => {
			describe('check input state change', () => {
				const { container } = render(<Checkbox />)
				const checkbox = getByRole(container, 'checkbox')

				it('should be changed from false to true after clicking on the checkbox', () => {
					expect(checkbox.checked).toBe(false)
					fireEvent.click(checkbox)
					expect(checkbox.checked).toBe(true)
				})

				it('should be changed from true to false after clicking on the checkbox', () => {
					expect(checkbox.checked).toBe(true)
					fireEvent.click(checkbox)
					expect(checkbox.checked).toBe(false)
				})
			})

			it('should trigger a change handler', async () => {
				const onChange = jest.fn()
				const { container } = render(<Checkbox onChange={ onChange } />)
				const checkbox = getByRole(container, 'checkbox')

				await userEvent.click(checkbox)
				expect(onChange).toBeCalled()
			})
		})

		describe('indeterminate checkbox', () => {
			describe('check input state change', () => {
				const { container } = render(<Checkbox indeterminate />)
				const checkbox = getByRole(container, 'checkbox')

				it('should be changed to checked after clicking on the checkbox', () => {
					expect(checkbox.indeterminate).toBe(true)
					expect(checkbox.checked).toBe(false)
					fireEvent.click(checkbox)
					expect(checkbox.checked).toBe(true)
				})

				it('should be changed to not checked after clicking on the checkbox again', () => {
					expect(checkbox.checked).toBe(true)
					fireEvent.click(checkbox)
					expect(checkbox.checked).toBe(false)
				})
			})

			it('should trigger a change handler', async () => {
				const onChange = jest.fn()
				const { container } = render(<Checkbox onChange={ onChange } />)
				const checkbox = getByRole(container, 'checkbox')

				await userEvent.click(checkbox)
				expect(onChange).toBeCalled()
			})
		})

		describe('disabled checkbox', () => {
			it('unchecked input should stay unchecked, change event should not be triggered', async () => {
				const onChange = jest.fn()
				const { container } = render(<Checkbox disabled onChange={ onChange } />)
				const checkbox = getByRole(container, 'checkbox')

				expect(checkbox.checked).toBe(false)
				await userEvent.click(checkbox)
				expect(checkbox.checked).toBe(false)
				expect(onChange).not.toBeCalled()
			})

			it('checked input should stay unchecked, change event should not be triggered', async () => {
				const onChange = jest.fn()
				const { container } = render(<Checkbox checked disabled onChange={ onChange } />)
				const checkbox = getByRole(container, 'checkbox')

				expect(checkbox.checked).toBe(true)
				await userEvent.click(checkbox)
				expect(checkbox.checked).toBe(true)
				expect(onChange).not.toBeCalled()
			})
		})
	})
})
