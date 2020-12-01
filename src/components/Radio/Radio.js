import React, { useContext } from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import styles from './Radio.module.scss'
import { ViewProvider } from '../ViewProvider'

const Radio = ({
  checked,
  indeterminate,
  disabled,
  view,
  onChange,
  className,
  id,
  ...otherProps
}) => {
  const isViewModeContext = useContext(ViewProvider.Context)
  const isViewMode = view !== undefined ? view : !!isViewModeContext

  const classes = classNames(
    styles.radio,
    checked && styles.checked,
    (disabled || isViewMode) && styles.disabled,
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
  /** If true, will be view mode. <br/>
   *  <i style="background-color:#ffc40026;">NOTE: Also from \<ViewProvider> by context. </i>
   */
  view: propTypes.bool,
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
