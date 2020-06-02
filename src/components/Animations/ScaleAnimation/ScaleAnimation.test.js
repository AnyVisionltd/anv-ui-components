import React from 'react'
import { render } from '@testing-library/react'
import ScaleAnimation from './ScaleAnimation'

describe('<ScaleAnimation/>', () => {
	it('should render when isOpen true', () => {
		const { container } = render(<ScaleAnimation isOpen><div>test</div></ScaleAnimation>)
		expect(container).toMatchSnapshot()
	})

	it('should NOT render when isOpen false', () => {
		const { container } = render(<ScaleAnimation isOpen={ false }><div>test</div></ScaleAnimation>)
		expect(container).toMatchSnapshot()
	})
})
