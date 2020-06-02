import React from 'react'
import { render } from '@testing-library/react'
import SlideAnimation from './SlideAnimation'

describe('<SlideAnimation/>', () => {
	it('should render when isOpen true', () => {
		const { container } = render(<SlideAnimation isOpen><div>test</div></SlideAnimation>)
		expect(container).toMatchSnapshot()
	})

	it('should NOT render when isOpen false', () => {
		const { container } = render(<SlideAnimation isOpen={ false }><div>test</div></SlideAnimation>)
		expect(container).toMatchSnapshot()
	})
})
