import React from 'react'
import classNames from 'classnames'
import propTypes from 'prop-types'
import { ReactComponent as CheckboxChecked } from '../../assets/svg/Checked.svg'
import { ReactComponent as CheckboxIndeterminate } from '../../assets/svg/CheckboxIndeterminate.svg'
import styles from './Checkbox.module.scss'


const Checkbox = ({
  checked,
  indeterminate,
  disabled,
  onChange,
  className,
  id,
  ...otherProps
}) => {
  const classes = classNames(
    styles.checkbox,
    checked && styles.checked,
    indeterminate && styles.indeterminate,
    disabled ? styles.disabled : styles.enabled,
    className,
  )

  const renderCheckboxIcon = () => {
    if (checked) {
      return <CheckboxChecked />
    }
    if (indeterminate) {
      return <CheckboxIndeterminate />
    }
    return null
  }

  const ref = (el) => {
    if (el) {
      el.indeterminate = indeterminate // eslint-disable-line no-param-reassign
    }
  }

  return (
    <label className={ classes } htmlFor={ id }>
      <input
        type="checkbox"
        ref={ ref }
        className={ styles.parent }
        checked={ checked }
        disabled={ disabled }
        onChange={ onChange }
        id={ id }
        { ...otherProps }
      />
      <span className={ styles.iconContainer }>
        { renderCheckboxIcon() }
      </span>
    </label>
  )
}

Checkbox.defaultProps = {
  disabled: false,
  checked: false,
  indeterminate: false,
  onChange: () => {},
}

Checkbox.propTypes = {
  /** If true, the checkbox will be disabled. */
  disabled: propTypes.bool,
  /** For css customization. */
  className: propTypes.string,
  /** Whether the checkbox is checked, or not. */
  checked: propTypes.bool,
  /** Whether the checkbox is indeterminate, or not. */
  indeterminate: propTypes.bool,
  /** Form control ID - for label association. */
  id: propTypes.string,
  /** Callback when changed. */
  onChange: propTypes.func,
}

export default Checkbox
