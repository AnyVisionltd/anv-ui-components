import React, { useRef, useEffect, memo } from 'react'
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

export default memo(DropdownItem)
