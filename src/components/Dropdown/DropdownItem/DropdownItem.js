import React, { useRef, useEffect } from 'react'
import { Tooltip, Checkbox } from '../../../index'
import classNames from 'classnames'
import useIsOverflowing from '../../../hooks/UseIsOverflowing/UseIsOverflowing'
import styles from './DropdownItem.module.scss'

const DropdownItem = ({
  index,
  option,
  isActive,
  isActiveByKeyboard,
  onClick,
  onOptionHover,
  multiple,
  isChosen,
}) => {
  const ref = useRef()
  const classes = classNames(styles.menuItem, { [styles.isChosen]: isChosen })

  return (
    <Tooltip content={option.value} show={useIsOverflowing(ref)}>
      <li className={classes} ref={ref} onClick={onClick}>
        {multiple && (
          <Checkbox
            checked={isChosen}
            onClick={onClick}
            className={styles.checkbox}
          />
        )}{' '}
        <p>{option.value}</p>
      </li>
    </Tooltip>
  )
}

export default DropdownItem
