import React, { useState, useRef, memo } from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import { ArrowUp, TimesThick } from '@anyvision/anv-icons'
import keymap from '../../utils/enums/keymap'
import { InputBase } from '../../index'
import { DropdownItem } from './DropdownItem'
import { useClickOutsideListener } from '../../hooks'
import styles from './Dropdown.module.scss'

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
  const [selectedOptions, setSelectedOptions] = useState([...defaultValues])
  const [showMenu, setShowMenu] = useState(false)
  const [focusedOptionIndex, setFocusedOptionIndex] = useState(-1)
  const containerRef = useRef(null)
  const menuRef = useRef(null)
  const inputRef = useRef(null)

  const closeMenu = () => {
    showMenu && setShowMenu(false)
    onMenuClose()
  }
  const getIntoTypeMode = () => {
    setIsTypeMode(true)
    setShowMenu(true)
  }
  const getOffTypeMode = () => {
    isTypeMode && setIsTypeMode(false)
    filteredValue.length && setFilteredValue('')
  }
  const resetFocusedOptionIndex = () => setFocusedOptionIndex(-1)

  useClickOutsideListener(() => {
    closeMenu()
    getOffTypeMode()
    resetFocusedOptionIndex()
  }, containerRef)

  const focusOption = direction => {
    if (!showMenu || !shownOptions.length) return
    if (direction === 'up') {
      const curFocusedOption = focusedOptionIndex - 1
      setFocusedOptionIndex(
        curFocusedOption < 0 ? shownOptions.length - 1 : curFocusedOption,
      )
    } else if (direction === 'down') {
      const curFocusedOption = focusedOptionIndex + 1
      setFocusedOptionIndex(
        curFocusedOption >= shownOptions.length ? 0 : curFocusedOption,
      )
    }
  }

  const handleFilterChange = e => {
    const value = e.target.value
    setFilteredValue(value)

    if (!value || !value.trim().length) {
      setShownOptions(options)
      return
    }

    const filteredOptions = options.filter(option =>
      option[displayValue].toLowerCase().startsWith(value.toLowerCase()),
    )
    setShownOptions(filteredOptions)
  }

  const handleItemClick = clickedOption => {
    if (!clickedOption) return
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

    if (!multiple) {
      getOffTypeMode()
      setShownOptions(options)
      closeMenu()
      resetFocusedOptionIndex()
    }
    !multiple && getOffTypeMode()
    // setShownOptions(options)
  }

  const handleRemoveOption = optionIndex => {
    selectedOptions.splice(optionIndex, 1)
    setSelectedOptions([...selectedOptions])
  }

  const selectOption = optionIndex => handleItemClick(shownOptions[optionIndex])

  const handleKeyDown = e => {
    switch (e.keyCode) {
      case keymap.ENTER:
        selectOption(focusedOptionIndex)
        break
      case keymap.ESCAPE:
        closeMenu()
        getOffTypeMode()
        resetFocusedOptionIndex()
        break
      case keymap.ARROW_UP:
        focusOption('up')
        break
      case keymap.ARROW_DOWN:
        focusOption('down')
        break
      default:
        break
    }
  }

  const renderValues = () => {
    if (isTypeMode && !multiple) return null
    if (!selectedOptions.length) {
      if (isTypeMode) return null
      return (
        <p className={styles.placeholder} onClick={getIntoTypeMode}>
          {placeholder}
        </p>
      )
    }

    let content
    if (multiple) {
      content = selectedOptions.map(({ value }, index) => (
        <button
          className={styles.selectedItem}
          key={index}
          onClick={() => handleRemoveOption(index)}
        >
          {value}
          <span>
            <TimesThick />
          </span>
        </button>
      ))
    } else {
      content = selectedOptions[0].value
    }

    return (
      <div className={styles.selectedValues} onClick={getIntoTypeMode}>
        {content}
      </div>
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

  const determineInputPlaceholder = () => {
    if (!multiple) {
      return selectedOptions.length ? selectedOptions[0].value : placeholder
    }
    return selectedOptions.length ? undefined : placeholder
  }

  const determineInputWidth = () => {
    if (!multiple) return '240px'
    return selectedOptions.length === 0 ? '240px' : ''
  }

  const renderHeaderContainer = () => {
    return (
      <div className={styles.selectedContainer} onKeyDown={handleKeyDown}>
        <label>{label}</label>
        {selectedOptions.length > 0 && multiple && renderDeleteButton()}
        <div className={styles.valuesContainer} onClick={getIntoTypeMode}>
          {renderValues()}
          {isTypeMode && (
            <InputBase
              autoFocus
              value={filteredValue}
              onChange={handleFilterChange}
              className={styles.inputBase}
              onBlur={getOffTypeMode}
              onKeyDown={handleKeyDown}
              placeholder={determineInputPlaceholder()}
              ref={inputRef}
              style={{ width: determineInputWidth() }}
              onKeyPress={() =>
                multiple &&
                (inputRef.current.style.width = `${filteredValue.length + 5}ch`)
              }
            />
          )}
        </div>
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
      <ul className={styles.menuContainer} ref={menuRef}>
        {shownOptions.map((option, index) => (
          <DropdownItem
            option={option}
            multiple={multiple}
            key={option.id}
            onClick={() => handleItemClick(option)}
            isSelected={selectedOptions.some(
              selected => selected.id === option.id,
            )}
            isFocusedByKeyboard={isTypeMode && index === focusedOptionIndex}
            index={index}
            menuRef={menuRef}
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
  onMenuClose: () => {},
  onMenuOpen: () => {},
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
  /** Set max number of items to choose, if used, set multiple to true. */
  maxAmount: propTypes.number,
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
