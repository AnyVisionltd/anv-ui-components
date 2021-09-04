import React, { useState, useRef, Fragment, memo } from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import { ArrowUp, TimesThick } from '@anyvision/anv-icons'
import keymap from '../../utils/enums/keymap'
import { InputBase } from '../../index'
import { DropdownItem } from './DropdownItem'
import { useClickOutsideListener } from '../../hooks'
import styles from './Dropdown.module.scss'

const keyboardButtons = [keymap.ENTER, keymap.ESCAPE]

// When user uses arrow down and up

const Dropdown = ({
  options,
  defaultValues,
  displayValue,
  keyValue,
  className,
  onChange,
  placeholder,
  label,
  disabled,
  onMenuOpen,
  onMenuClose,
  multiple,
}) => {
  const [isTypeMode, setIsTypeMode] = useState(false)
  const [filteredValue, setFilteredValue] = useState('')
  const [shownOptions, setShownOptions] = useState([...options])
  const [showMenu, setShowMenu] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState([...defaultValues])
  const containerRef = useRef(null)

  const getIntoTypeMode = () => {
    setIsTypeMode(true)
    setShowMenu(true)
  }
  const getOffTypeMode = () => isTypeMode && setIsTypeMode(false)

  useClickOutsideListener(() => {
    setShowMenu(false)
    getOffTypeMode()
  }, containerRef)

  const handleKeyPress = e => {
    if (keyboardButtons.includes(e.keyCode)) {
      getOffTypeMode()
    }
  }

  const handleFilterChange = e => {
    const value = e.target.value
    setFilteredValue(value)

    const filteredOptions = options.filter(option =>
      option[displayValue].toLowerCase().startsWith(value.toLowerCase()),
    )
    setShownOptions(filteredOptions)
  }

  const handleItemClick = clickedOption => {
    // if multiple and if not multiple
    const { id } = clickedOption
    const isFoundInDropdown = selectedOptions.find(option => option.id === id)
    if (multiple) {
      if (isFoundInDropdown) {
        setSelectedOptions(selectedOptions.filter(option => option.id !== id))
      } else {
        setSelectedOptions([...selectedOptions, clickedOption])
      }
    } else {
      if (isFoundInDropdown) {
        setSelectedOptions([])
      } else {
        setSelectedOptions([clickedOption])
      }
    }

    getOffTypeMode()
    setShownOptions(options)
    setFilteredValue('')
  }

  const renderTextValue = () => {
    if (!selectedOptions.length) {
      return (
        <p className={styles.placeholder} onClick={getIntoTypeMode}>
          {placeholder}
        </p>
      )
    }

    const content = selectedOptions.map(({ value }, index, arr) => (
      <Fragment key={index}>
        {value}
        {index !== arr.length - 1 && ', '}
      </Fragment>
    ))
    return (
      <p className={styles.selectedValues} onClick={getIntoTypeMode}>
        {content}
      </p>
    )
  }

  const renderDeleteButton = () => (
    <button
      className={styles.multipleDelete}
      onClick={() => setSelectedOptions([])}
    >
      {selectedOptions.length}{' '}
      <span>
        <TimesThick />
      </span>
    </button>
  )

  const renderHeaderContainer = () => {
    return (
      <div className={styles.selectedContainer} onKeyPress={handleKeyPress}>
        <label>{label}</label>
        {isTypeMode ? (
          <InputBase
            autoFocus
            value={filteredValue}
            onChange={handleFilterChange}
            className={styles.inputBase}
            onBlur={getOffTypeMode}
            onKeyPress={handleKeyPress}
          />
        ) : (
          <>
            {selectedOptions.length > 0 && multiple && renderDeleteButton()}
            {renderTextValue()}
          </>
        )}

        <div className={styles.icons}>
          <ArrowUp
            className={classNames({ [styles.rotated]: showMenu })}
            onClick={() => setShowMenu(!showMenu)}
          />
        </div>
      </div>
    )
  }

  const renderOptions = () => {
    // Like monday combobox option
    // Add handle key press for the edit.
    return (
      <ul className={styles.menuContainer}>
        {shownOptions.map((option, index) => (
          <DropdownItem
            option={option}
            multiple={multiple}
            key={option.id}
            onClick={() => handleItemClick(option)}
            isChosen={selectedOptions.some(
              selected => selected.id === option.id,
            )}
          />
        ))}
      </ul>
    )
  }

  return (
    <div className={classNames(styles.container, className)} ref={containerRef}>
      {renderHeaderContainer()}
      {showMenu && renderOptions()}
    </div>
  )
}

Dropdown.defaultProps = {
  options: [],
  defaultValues: [],
  placeholder: 'Select Option',
  label: 'Label',
  displayValue: 'value',
  keyValue: 'id',
}

Dropdown.propTypes = {
  /** Dropdown options. */
  options: propTypes.arrayOf(propTypes.object),
  /** Defauly values for the dropdown. */
  defaultValues: propTypes.arrayOf(propTypes.object),
  /** Value to display from option. Default is 'value'. */
  displayValue: propTypes.string,
  /** Unique key of the option. Default is 'id'. */
  keyValue: propTypes.string,
  /** Set if multi selection is enabled. */
  multiple: propTypes.bool,
  /** Called when selected value has changed. */
  onChange: propTypes.func,
  /** Custom style for container' className. */
  className: propTypes.string,
  /** Placeholder to show when no value is selected. */
  placeholder: propTypes.string,
  /** Label to add information about  the dropdown. */
  label: propTypes.string,
  /** Set dropdown to disabled if true. */
  disabled: propTypes.bool,
  /** Called when menu is opened. */
  onMenuOpen: propTypes.func,
  /** Called when menu is closed. */
  onMenuClose: propTypes.func,
}

export default memo(Dropdown)
