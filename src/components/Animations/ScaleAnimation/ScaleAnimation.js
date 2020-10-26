import React from 'react'
import propTypes from 'prop-types'
import { CSSTransition } from 'react-transition-group'
import './ScaleAnimation.scss'

const ScaleAnimation = ({
  children,
  isOpen,
  verticalStart,
  horizontalStart,
  ...otherProps
}) => (
  <CSSTransition
    in={isOpen}
    unmountOnExit
    classNames={`scale-${verticalStart}-${horizontalStart}`}
    timeout={200}
    {...otherProps}
  >
    {children}
  </CSSTransition>
)

ScaleAnimation.defaultProps = {
  verticalStart: 'center',
  horizontalStart: 'center',
}

ScaleAnimation.propTypes = {
  /** If <code>true</code> display <code>children</code>. */
  isOpen: propTypes.bool.isRequired,
  /** Animation vertical starting position. */
  verticalStart: propTypes.oneOf(['center', 'top', 'bottom']),
  /** Animation vertical starting position. */
  horizontalStart: propTypes.oneOf(['center', 'start', 'end']),
  /** The component content. */
  children: propTypes.element.isRequired,
}

export default ScaleAnimation
