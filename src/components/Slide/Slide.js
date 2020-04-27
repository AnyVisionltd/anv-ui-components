import React from 'react'
import propTypes from 'prop-types'
import { CSSTransition } from 'react-transition-group'
import './Slide.scss'

const Slide = ({ children, isOpen, direction }) => (
  <CSSTransition
    in={ isOpen }
    unmountOnExit
    classNames={ `slide-${direction}` }
    timeout={ 200 }
  >
    { children }
  </CSSTransition>
)

Slide.defaultProps = {
  direction: 'up',
}

Slide.propTypes = {
  /** If <code>true</code> display <code>children</code>. */
  isOpen: propTypes.bool.isRequired,
  /** Animation direction. */
  direction: propTypes.oneOf(['up', 'right', 'down', 'left']),
  /** The component content. */
  children: propTypes.node.isRequired,
}

export default Slide
