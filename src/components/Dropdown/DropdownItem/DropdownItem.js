import React, { useRef, useEffect, memo } from 'react'
import propTypes from 'prop-types'
import { Tooltip, Checkbox } from '../../../index'
import classNames from 'classnames'
import useIsOverflowing from '../../../hooks/UseIsOverflowing/UseIsOverflowing'
import styles from './DropdownItem.module.scss'

const DropdownItem = ({
  option,
  displayValue,
  isFocusedByKeyboard,
  onClick,
  multiple,
  isSelected,
  menuRef,
  valueRender,
}) => {
  const labelRef = useRef(null)
  const classes = classNames(styles.menuItem, {
    [styles.isSelected]: isSelected,
    [styles.isFocusedByKeyboard]: isFocusedByKeyboard,
    [styles.isDisabled]: !!option.disabled,
  })

  useEffect(() => {
    if (!isFocusedByKeyboard) return
    const menu = menuRef?.current
    const item = labelRef?.current
    if (menu && item) {
      menu.scrollTop =
        item.offsetTop -
        menu.offsetTop +
        item.clientHeight -
        (2 / 3) * menu.offsetHeight
    }
  }, [labelRef, menuRef, isFocusedByKeyboard])

  return (
    <Tooltip content={option[displayValue]} show={useIsOverflowing(labelRef)}>
      <li className={classes} onClick={onClick}>
        {multiple && (
          <Checkbox
            checked={isSelected}
            onClick={onClick}
            className={styles.checkbox}
          />
        )}
        <div ref={labelRef} className={styles.content}>
          {valueRender
            ? valueRender(option[displayValue])
            : option[displayValue]}
        </div>
      </li>
    </Tooltip>
  )
}

DropdownItem.propTypes = {
  /** Dropdown option. */
  option: propTypes.object,
  /** Value to display from option. Default is 'value'. */
  displayValue: propTypes.string,
  /** Determines if the dropdown item is focused by user's keyboard. */
  isFocusedByKeyboard: propTypes.bool,
  /** Set if multi selection is enabled. */
  multiple: propTypes.bool,
  /** Called when selected value has clicked. */
  onClick: propTypes.func,
  /** Whether the option is selected or not. */
  isSelected: propTypes.bool,
  /** Custom value renderer function. */
  valueRender: propTypes.func,
  /** Menu element. */
  menuRef: propTypes.element,
}

export default memo(DropdownItem)
