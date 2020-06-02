import React from 'react'
import propTypes from 'prop-types'
import { CSSTransition } from 'react-transition-group'
import './SlideAnimation.scss'

const SlideAnimation = ({ children, isOpen, direction }) => (
	<CSSTransition
		in={ isOpen }
		unmountOnExit
		classNames={ `slide-${direction}` }
		timeout={ 200 }
	>
		{ children }
	</CSSTransition>
)

SlideAnimation.defaultProps = {
	direction: 'up',
}

SlideAnimation.propTypes = {
	/** If <code>true</code> display <code>children</code>. */
	isOpen: propTypes.bool.isRequired,
	/** Animation direction. */
	direction: propTypes.oneOf(['up', 'right', 'down', 'left']),
	/** The component content. */
	children: propTypes.element.isRequired,
}

export default SlideAnimation
