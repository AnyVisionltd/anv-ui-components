import React from 'react'
import classNames from 'classnames'
import propTypes from 'prop-types'
import { useFormProvider } from '../../index'
import { ReactComponent as CheckboxChecked } from '../../assets/svg/Checked.svg'
import { ReactComponent as CheckboxIndeterminate } from '../../assets/svg/CheckboxIndeterminate.svg'
import styles from './Checkbox.module.scss'

const Checkbox = ({
  checked,
  indeterminate,
  toggled,
  disabled,
  view,
  onChange,
  className,
  id,
  renderIcon,
  ...otherProps
}) => {
  const { isView } = useFormProvider({ view })

  const classes = classNames(
    styles.checkbox,
    checked && styles.checked,
    indeterminate && styles.indeterminate,
    toggled && styles.toggled,
    (disabled || isView) && styles.disabled,
    className,
  )

  const renderCheckboxIcon = () => {
    if (renderIcon) return renderIcon(checked)
    if (checked) {
      return <CheckboxChecked />
    }
    if (indeterminate) {
      return <CheckboxIndeterminate />
    }
    return null
  }

  const ref = el => {
    if (el) {
      el.indeterminate = indeterminate // eslint-disable-line no-param-reassign
    }
  }

  return (
    <label className={classes} htmlFor={id}>
      <input
        type='checkbox'
        ref={ref}
        className={styles.parent}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        id={id}
        {...otherProps}
      />
      <span className={styles.iconContainer}>{renderCheckboxIcon()}</span>
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
  /** If true, will be view mode. <br/>
   *  <i style="background-color:#ffc40026;">NOTE: Also from \<FormProvider> by context. </i>
   */
  view: propTypes.bool,
  /** For css customization. */
  className: propTypes.string,
  /** Whether the checkbox is checked, or not. */
  checked: propTypes.bool,
  /** Whether the checkbox is toggled, or not. */
  toggled: propTypes.bool,
  /** Whether the checkbox is indeterminate, or not. */
  indeterminate: propTypes.bool,
  /** Form control ID - for label association. */
  id: propTypes.string,
  /** Callback when changed. */
  onChange: propTypes.func,
}

export default Checkbox
