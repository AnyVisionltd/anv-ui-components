import React, { useRef, memo } from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import { Tooltip, Checkbox } from '../../../index'
import { useIsOverflowing } from '../../../hooks'
import styles from './DropdownItem.module.scss'

const DropdownItem = ({
  option,
  displayValue,
  isFocusedByKeyboard,
  onClick,
  multiple,
  isSelected,
  valueRender,
  optionRender,
}) => {
  const labelRef = useRef(null)
  const classes = classNames(styles.menuItem, {
    [styles.isSelected]: isSelected,
    [styles.isFocusedByKeyboard]: isFocusedByKeyboard,
    [styles.isDisabled]: !!option.disabled,
  })

  const showOptionTooltip = useIsOverflowing(labelRef)

  const renderCheckbox = () => (
    <Checkbox
      checked={isSelected}
      onClick={onClick}
      className={styles.checkbox}
    />
  )

  if (optionRender) {
    return optionRender(option, {
      renderCheckbox: multiple ? renderCheckbox : undefined,
      isSelected,
      isFocusedByKeyboard,
    })
  }

  return (
    <Tooltip content={option[displayValue]} show={showOptionTooltip}>
      <li className={classes} onClick={onClick}>
        {multiple && renderCheckbox()}
        <div ref={labelRef} className={styles.content}>
          {valueRender
            ? valueRender(option[displayValue], option)
            : option[displayValue]}
        </div>
      </li>
    </Tooltip>
  )
}

DropdownItem.propTypes = {
  /** Dropdown option. */
  option: propTypes.object,
  /** Value to display from option. */
  displayValue: propTypes.string,
  /** Determines if the dropdown item is focused by user's keyboard. */
  isFocusedByKeyboard: propTypes.bool,
  /** Set if multi selection is enabled. */
  multiple: propTypes.bool,
  /** A callback triggered whenever the user clicked on the item. */
  onClick: propTypes.func,
  /** Whether the option is selected or not. */
  isSelected: propTypes.bool,
  /** Custom value renderer function. */
  valueRender: propTypes.func,
  /** Custom option renderer function. Function returns render selection checkbox as well. */
  optionRender: propTypes.func,
  /** Menu element. */
  menuRef: propTypes.shape({ current: propTypes.instanceOf(Element) }),
}

export default memo(DropdownItem)
