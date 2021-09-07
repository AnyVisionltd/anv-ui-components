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
}) => {
  const labelRef = useRef(null)
  const classes = classNames(styles.menuItem, {
    [styles.isSelected]: isSelected,
    [styles.isFocusedByKeyboard]: isFocusedByKeyboard,
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
    <Tooltip content={option.value} show={useIsOverflowing(labelRef)}>
      <li className={classes} onClick={onClick}>
        {multiple && (
          <Checkbox
            checked={isSelected}
            onClick={onClick}
            className={styles.checkbox}
          />
        )}
        <p ref={labelRef}>{option[displayValue]}</p>
      </li>
    </Tooltip>
  )
}

export default memo(DropdownItem)
