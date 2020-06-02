import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { ReactComponent as SvgIcon } from '../../../jest/assets/svgIcon.svg'
import IconButton from './IconButton'

describe('<IconButton />', () => {
	it('should render children into button', () => {
		const { container } = render(<IconButton><SvgIcon /></IconButton>)
		const node = container.querySelector('svg')
		expect(node).toBeTruthy()
	})

	describe('disabled', () => {
		it('should NOT be disabled by default', () => {
			const { getByRole } = render(<IconButton><SvgIcon /></IconButton>)
			const node = getByRole('button')
			expect(node.disabled).toBe(false)
		})

		it('should be disabled when disabled pass', () => {
			const { getByRole } = render(<IconButton disabled><SvgIcon /></IconButton>)
			const node = getByRole('button')
			expect(node).toBeDisabled()
		})
	})

	it('should call onClick', () => {
		const handleClick = jest.fn()
		const { getByRole } = render(
			<IconButton onClick={ handleClick }><SvgIcon /></IconButton>,
		)
		const node = getByRole('button')
		fireEvent.click(node)
		expect(handleClick).toBeCalled()
	})
})
