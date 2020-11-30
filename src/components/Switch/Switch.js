import React, { useContext } from 'react'
import classNames from 'classnames'
import propTypes from 'prop-types'
import styles from './Switch.module.scss'
import { ViewProvider } from '../ViewProvider'

const Switch = ({
  id,
  className,
  checked,
  disabled,
  view,
  onChange,
  onClick,
  ...otherProps
}) => {
  const isViewModeContext = useContext(ViewProvider.Context)
  const isViewMode = view || isViewModeContext

  const classes = classNames(
    styles.switch,
    !checked && styles.unchecked,
    (disabled || isViewMode) && styles.disabled,
    className,
  )

  return (
    <div className={classes} onClick={onClick}>
      <label className={styles.switchLabel} htmlFor={id}>
        <div className={styles.switchLine} />
        <div className={styles.switchToggle}>
          <span className={styles.switchToggleInner} />
          <input
            id={id}
            type='checkbox'
            disabled={disabled}
            defaultChecked={checked}
            onChange={onChange}
            {...otherProps}
          />
        </div>
      </label>
    </div>
  )
}

Switch.defaultProps = {
  disabled: false,
  onChange: () => {},
}

Switch.propTypes = {
  /** Form control ID - for label association. */
  id: propTypes.string,
  /** For css customization. */
  className: propTypes.string,
  /** Whether the switch is checked or not. */
  checked: propTypes.bool,
  /** If true, the switch will be disabled. */
  disabled: propTypes.bool,
  /** If true, will be view mode. <br/>
   *  <i style="background-color:#ffc40026;">NOTE: Also from \<ViewProvider> by context. </i>
   */
  view: propTypes.bool,
  /** Callback when changed. */
  onChange: propTypes.func,
}

export default Switch
