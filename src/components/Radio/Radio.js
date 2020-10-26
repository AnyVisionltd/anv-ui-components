import React from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import styles from './Radio.module.scss'

const Radio = ({
  checked,
  indeterminate,
  disabled,
  onChange,
  className,
  id,
  ...otherProps
}) => {
  const classes = classNames(
    styles.radio,
    checked && styles.checked,
    disabled && styles.disabled,
    className,
  )

  const renderDot = () => {
    if (checked) {
      return <span className={styles.circle} />
    }
    return null
  }

  return (
    <label className={classes} htmlFor={id}>
      <input
        type='radio'
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        id={id}
        {...otherProps}
      />
      <span className={styles.iconContainer}>{renderDot()}</span>
    </label>
  )
}

Radio.defaultProps = {
  disabled: false,
  checked: false,
  onChange: () => {},
}

Radio.propTypes = {
  /** If true, the radio will be disabled. */
  disabled: propTypes.bool,
  /** For css customization. */
  className: propTypes.string,
  /** Whether the radio button is selected or not. */
  checked: propTypes.bool,
  /** Form control ID - for label association*/
  id: propTypes.string,
  /** Callback when the component's selected state changed. */
  onChange: propTypes.func,
}

export default Radio
