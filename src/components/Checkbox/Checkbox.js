import React from 'react'
import classNames from 'classnames'
import propTypes from 'prop-types'
import colors from '@anyvision/style-guide/abstracts/_colors.scss'
import { ReactComponent as CheckboxChecked } from '../../assets/svg/CheckboxChecked.svg'
import { ReactComponent as CheckboxIndeterminate } from '../../assets/svg/CheckboxIndeterminate.svg'
import styles from './Checkbox.module.scss'

const styleGuideColors = Object.keys(colors)

const Checkbox = ({
  color, checked, indeterminate, disabled, onChange, className, id,
}) => {
  const classes = classNames(
    styles.checkbox,
    styles[color],
    styles[`checkbox-${color}`],
    checked && styles.checked,
    indeterminate && styles.indeterminate,
    disabled && styles.isDisabled,
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
      />
      <span className={ styles.iconContainer }>
        { renderCheckboxIcon() }
      </span>
    </label>
  )
}

Checkbox.defaultProps = {
  color: 'primary',
  disabled: false,
  checked: false,
  indeterminate: false,
  onChange: () => {},
}

Checkbox.propTypes = {
  /** The color of the checkbox. */
  color: propTypes.oneOf(styleGuideColors),
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
