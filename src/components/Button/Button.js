import React from 'react'
import classNames from 'classnames'
import propTypes from 'prop-types'
import styles from './Button.module.scss'

const Button = ({
  color, size, variant, disabled, onClick, className, children,
}) => {
  const classes = classNames(
    styles[color],
    styles[size],
    styles[`${color}-${variant}`],
    className,
  )

  return (
    <button
      type="button"
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
  /** For css customizition. */
  className: propTypes.string,
  /** Show or hide the component. */
  children: propTypes.node,
}

export default Button
