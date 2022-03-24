import React, { useRef, memo } from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import { Tooltip } from '../../../index'
import { useIsOverflowing } from '../../../hooks'
import styles from './Autocomplete.module.scss'

const Autocomplete = ({
  option,
  displayValue,
  isFocusedByKeyboard,
  onClick,
  isSelected,
  valueRender,
}) => {
  const labelRef = useRef(null)
  const classes = classNames(styles.menuItem, {
    [styles.isSelected]: isSelected,
    [styles.isFocusedByKeyboard]: isFocusedByKeyboard,
    [styles.isDisabled]: !!option.disabled,
  })

  return (
    <Tooltip content={option[displayValue]} show={useIsOverflowing(labelRef)}>
      <li className={classes} onClick={onClick}>
        <div ref={labelRef} className={styles.content}>
          {valueRender
            ? valueRender(option[displayValue], option)
            : option[displayValue]}
        </div>
      </li>
    </Tooltip>
  )
}

Autocomplete.propTypes = {
  /** Dropdown option. */
  option: propTypes.object,
  /** Value to display from option. */
  displayValue: propTypes.string,
  /** Determines if the dropdown item is focused by user's keyboard. */
  isFocusedByKeyboard: propTypes.bool,
  /** A callback triggered whenever the user clicked on the item. */
  onClick: propTypes.func,
  /** Whether the option is selected or not. */
  isSelected: propTypes.bool,
  /** Custom value renderer function. */
  valueRender: propTypes.func,
  /** Menu element. */
  menuRef: propTypes.shape({ current: propTypes.instanceOf(Element) }),
}

export default memo(Autocomplete)
