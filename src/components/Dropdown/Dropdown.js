import React, { useState, useRef, memo } from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import { ArrowUp, TimesThick } from '@anyvision/anv-icons'
import keymap from '../../utils/enums/keymap'
import { InputBase } from '../../index'
import { DropdownItem } from './DropdownItem'
import { EmptyDropdownMenu } from './EmptyDropdownMenu'
import { useClickOutsideListener } from '../../hooks'
import IconButton from '../IconButton/IconButton'
import { ReactComponent as CancelFilledIcon } from '../../assets/svg/CancelFilled.svg'
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
  isDisabled,
  onMenuOpen,
  onMenuClose,
  onExceedMaxSelected,
  multiple,
  maxSelected,
  noOptionsMessage,
  isSearchable,
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
  const valuesContainerRef = useRef(null)

  const openMenu = () => {
    if (showMenu) return
    setShowMenu(true)
    onMenuOpen()
  }

  const closeMenu = () => {
    if (!showMenu) return
    setShowMenu(false)
    setShownOptions([...options])
    onMenuClose()
  }

  const toggleMenu = () => (showMenu ? closeMenu() : openMenu())

  const getIntoTypeMode = () => {
    isSearchable && setIsTypeMode(true)
    openMenu()
  }

  const getOffTypeMode = () => {
    isTypeMode && setIsTypeMode(false)
    filteredValue.length && setFilteredValue('')
  }

  const resetFocusedOptionIndex = () => setFocusedOptionIndex(-1)

  const resetFilteredValue = () => {
    setFilteredValue('')
    setShownOptions([...options])
  }

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
    if (maxSelected && maxSelected === selectedOptions.length) {
      return onExceedMaxSelected()
    }
    const { [keyValue]: key } = clickedOption
    const isFoundInDropdown = selectedOptions.find(
      option => option[keyValue] === key,
    )
    let newOptions
    if (multiple) {
      if (isFoundInDropdown) {
        newOptions = selectedOptions.filter(option => option[keyValue] !== key)
      } else {
        newOptions = [...selectedOptions, clickedOption]
      }
    } else {
      if (isFoundInDropdown) {
        newOptions = []
      } else {
        newOptions = [clickedOption]
      }
    }
    setSelectedOptions(newOptions)
    onChange(newOptions)

    if (!multiple) {
      getOffTypeMode()
      setShownOptions(options)
      closeMenu()
      resetFocusedOptionIndex()
    }
    !multiple && getOffTypeMode()
  }

  const handleRemoveOption = optionIndex => {
    const newOptions = [...selectedOptions]
    newOptions.splice(optionIndex, 1)
    setSelectedOptions([...newOptions])
    onChange(newOptions)
  }

  const popLastValue = () => {
    const newOptions = selectedOptions.slice(0, selectedOptions.length - 1)
    setSelectedOptions(newOptions)
    onChange(newOptions)
  }

  const emptySelectedOptions = () => {
    setSelectedOptions([])
    onChange([])
  }

  const selectOption = optionIndex => handleItemClick(shownOptions[optionIndex])

  const handleKeyDown = e => {
    switch (e.keyCode) {
      case keymap.ENTER:
        selectOption(focusedOptionIndex)
        resetFilteredValue()
        break
      case keymap.ESCAPE:
        closeMenu()
        getOffTypeMode()
        resetFocusedOptionIndex()
        break
      case keymap.BACKSPACE:
        if (filteredValue) return
        if (multiple && selectedOptions.length) {
          popLastValue()
        }
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

  const renderClearInputButton = () => {
    if (!filteredValue.length) return
    return (
      <IconButton
        variant='ghost'
        onClick={() => {}}
        aria-label='clear input'
        disabled={isDisabled}
      >
        <CancelFilledIcon className={styles.clearIcon} />
      </IconButton>
    )
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

    if (multiple) {
      return selectedOptions.map(({ value }, index) => (
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
      return (
        <p className={styles.selectedValue} onClick={getIntoTypeMode}>
          {selectedOptions[0][displayValue]}
        </p>
      )
    }
  }

  const renderDeleteButton = () => (
    <button className={styles.deleteButton} onClick={emptySelectedOptions}>
      {selectedOptions.length}
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
    const containerWidth = valuesContainerRef.current.offsetWidth
    if (!multiple) return `${containerWidth}px`
    return selectedOptions.length === 0 ? `${containerWidth}px` : ''
  }

  const renderHeaderContainer = () => {
    return (
      <div className={styles.selectedContainer} onKeyDown={handleKeyDown}>
        <label>{label}</label>
        <div
          className={styles.selectedContentContainer}
          onClick={getIntoTypeMode}
        >
          {selectedOptions.length > 0 && multiple && renderDeleteButton()}
          <div className={styles.valuesContainer} ref={valuesContainerRef}>
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
                trailingIcon={renderClearInputButton}
                ref={inputRef}
                style={{ width: determineInputWidth() }}
                onKeyPress={() =>
                  multiple &&
                  (inputRef.current.style.width = `${
                    filteredValue.length + 5
                  }ch`)
                }
              />
            )}
          </div>
        </div>
        <div className={styles.icons}>
          <ArrowUp
            className={classNames({ [styles.rotated]: showMenu })}
            onClick={toggleMenu}
          />
        </div>
      </div>
    )
  }

  const renderOptions = () => (
    <ul className={styles.menuContainer} ref={menuRef}>
      {!shownOptions.length ? (
        <EmptyDropdownMenu
          noOptionsMessage={noOptionsMessage}
          searchValue={filteredValue}
        />
      ) : (
        shownOptions.map((option, index) => (
          <DropdownItem
            option={option}
            displayValue={displayValue}
            disabled={option.disabled === true}
            multiple={multiple}
            key={option[keyValue]}
            onClick={() => handleItemClick(option)}
            isSelected={selectedOptions.some(
              selected => selected[keyValue] === option[keyValue],
            )}
            isFocusedByKeyboard={isTypeMode && index === focusedOptionIndex}
            menuRef={menuRef}
          />
        ))
      )}
    </ul>
  )

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
  multiple: false,
  isSearchable: true,
  isDisabled: false,
  noOptionsMessage: 'No results found',
  onMenuClose: () => {},
  onMenuOpen: () => {},
  onChange: () => {},
  onExceedMaxSelected: () => {},
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
  maxSelected: propTypes.number,
  /** Called when max selected options is exceeded. */
  onExceedMaxSelected: propTypes.func,
  /** Called when selected value has changed. */
  onChange: propTypes.func,
  /** Whether to enable search functionality. */
  isSearchable: propTypes.bool,
  /** Custom style for container' className. */
  className: propTypes.string,
  /** Placeholder to show when no value is selected. */
  placeholder: propTypes.string,
  /** Label to add information about  the dropdown. */
  label: propTypes.string,
  /** Set dropdown to disabled if true. */
  isDisabled: propTypes.bool,
  /** Called when menu is opened. */
  onMenuOpen: propTypes.func,
  /** Called when menu is closed. */
  onMenuClose: propTypes.func,
  /** Custom option renderer function. */
  optionRenderer: propTypes.oneOfType([propTypes.func, propTypes.object]),
  /** Text / component to display when there are no options. */
  noOptionsMessage: propTypes.oneOfType([propTypes.string, propTypes.func]),
}

export default memo(Dropdown)
