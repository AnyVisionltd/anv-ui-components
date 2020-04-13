import React from 'react'
import classNames from 'classnames'
import propTypes from 'prop-types'
import styles from './Button.module.scss'

const Button = ({
  color, size, variant, disabled, onClick, className, children, type,
}) => {
  const classes = classNames(
    styles[color],
    styles[size],
    styles[`${color}-${variant}`],
    className,
  )

  return (
    <button
      type={ type }
      className={ classes }
      onClick={ onClick }
      disabled={ disabled }
    >
      { children }
    </button>
  )
}

Button.defaultProps = {
  color: 'primary',
  size: 'large',
  variant: 'fill',
  disabled: false,
  onClick: () => {},
  type: 'button',
}

Button.propTypes = {
  /** The size of the button. */
  color: propTypes.oneOf(['primary', 'secondary', 'accent', 'decorative']),
  /** The size of the button. */
  size: propTypes.oneOf(['small', 'large']),
  /** The size of the button. */
  variant: propTypes.oneOf(['fill', 'outline', 'ghost']),
  /** If true, the button will be disabled. */
  disabled: propTypes.bool,
  /** Callback when click. */
  onClick: propTypes.func,
  /** Defines HTML button type attribute. */
  type: propTypes.oneOf(['button', 'reset', 'submit']),
  /** For css customizition. */
  className: propTypes.string,
  /** The component content. */
  children: propTypes.node,
}

export default Button
