import React from 'react'
import propTypes from 'prop-types'
import { CSSTransition } from 'react-transition-group'
import './ScaleAnimation.scss'

const ScaleAnimation = ({
  children, isOpen, verticalStart, horizontalStart, ...otherProps
}) => (
  <CSSTransition
    in={ isOpen }
    unmountOnExit
    classNames={ `scale-${verticalStart}-${horizontalStart}` }
    timeout={ 200 }
    { ...otherProps }
  >
    { children }
  </CSSTransition>
)

ScaleAnimation.defaultProps = {
  verticalStart: 'top',
  horizontalStart: 'start',
}

ScaleAnimation.propTypes = {
  /** If <code>true</code> display <code>children</code>. */
  isOpen: propTypes.bool.isRequired,
  /** Animation vertical starting position. */
  verticalStart: propTypes.oneOf(['top', 'bottom']),
  /** Animation vertical starting position. */
  horizontalStart: propTypes.oneOf(['start', 'end']),
  /** The component content. */
  children: propTypes.element.isRequired,
}

export default ScaleAnimation
