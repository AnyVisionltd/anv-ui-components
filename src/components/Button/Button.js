import React from 'react'
import classNames from 'classnames'
import propTypes from 'prop-types'
import colors from '@anyvision/style-guide/abstracts/_colors.scss'
import styles from './Button.module.scss'

const styleGuideColors = Object.keys(colors)

const Button = ({
  color, size, variant, disabled, onClick, className, children, type,
}) => {
  const classes = classNames(
    styles.button,
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
  /** The color of the button. */
  color: propTypes.oneOf(styleGuideColors),
  /** The size of the button. */
  size: propTypes.oneOf(['small', 'large']),
  /** The variant of the button. */
  variant: propTypes.oneOf(['fill', 'outline', 'ghost']),
  /** If true, the button will be disabled. */
  disabled: propTypes.bool,
  /** Callback when click. */
  onClick: propTypes.func,
  /** Defines HTML button type attribute. */
  type: propTypes.oneOf(['button', 'reset', 'submit']),
  /** For css customization. */
  className: propTypes.string,
  /** The component content. */
  children: propTypes.node,
}

export default Button
