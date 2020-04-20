import React from 'react'
import classNames from 'classnames'
import propTypes from 'prop-types'
import colors from '@anyvision/style-guide/abstracts/_colors.scss'
import styles from './Checkbox.module.scss'

const styleGuideColors = Object.keys(colors)

const Checkbox = ({ color, checked, indeterminate, disabled, onChange, className, children }) => {
  const classes = classNames(
    styles.checkboxContainer,
    styles[color],
    className,
  )

  return (
    <div className={ classes }>
      <input
        type='checkbox'
        className={ styles.checkbox }
        aria-label={ children }
        checked={ checked }
        disabled={ disabled }
        ref={ el => el && (el.indeterminate = indeterminate) }
        onChange={ onChange }
      />
      <label className={ styles.label }>{ children }</label>
    </div>
  )
}

Checkbox.defaultProps = {
  color: 'primary',
  disabled: false,
  checked: false,
  indeterminate: false,
  onClick: () => {}
}

Checkbox.propTypes = {
  /** The color of the button. */
  color: propTypes.oneOf(styleGuideColors),
  /** If true, the button will be disabled. */
  disabled: propTypes.bool,
  /** For css customization. */
  className: propTypes.string,
  /** Whether the checkbox is checked, or not. */
  checked: propTypes.bool,
  /** Whether the checkbox is indeterminate, or not. */
  indeterminate: propTypes.bool,
  /** Callback when changed. */
  onChange: propTypes.func,
  /** The component content. */
  children: propTypes.node,
}

export default Checkbox
