import React, { useState, useRef, memo, useEffect, useCallback } from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import { ArrowUp, TimesThick } from '@anyvision/anv-icons'
import keymap from '../../utils/enums/keymap'
import { InputBase, IconButton } from '../../index'
import { DropdownItem } from './DropdownItem'
import { EmptyDropdownMenu } from './EmptyDropdownMenu'
import { useClickOutsideListener } from '../../hooks'
import { ReactComponent as CancelFilledIcon } from '../../assets/svg/CancelFilled.svg'
import languageService from '../../services/language'
import styles from './Dropdown.module.scss'

// var(--sz-56, 56px)
// const defaultSelectedHeight = +styles.defaultSelectedHeight.split(' ')[1].slice(0, 2)
const defaultSelectedHeight = 56
const getTranslation = path => languageService.getTranslation(`${path}`)

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
  isSelectedShownInHeader,
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
  const selectedContainerRef = useRef(null)
  const valuesContainerRef = useRef(null)

  useEffect(() => {
    const detectTarget = e => console.log(e.target)
    document.addEventListener('click', detectTarget)
    return () => document.removeEventListener('click', detectTarget)
  }, [])

  const resetToOriginalOptions = () =>
    shownOptions.length !== options.length && setShownOptions(options)

  const openMenu = () => {
    if (showMenu) return
    setShowMenu(true)
    onMenuOpen()
  }

  const closeMenu = () => {
    if (!showMenu) return
    setShowMenu(false)
    resetToOriginalOptions()
    onMenuClose()
  }

  const toggleMenu = () => (showMenu ? closeMenu() : openMenu())

  const getIntoTypeMode = () => {
    isSearchable && setIsTypeMode(true)
    !showMenu && openMenu()
  }

  const getOffTypeMode = () => {
    isTypeMode && setIsTypeMode(false)
    filteredValue.length && setFilteredValue('')
  }

  const resetFocusedOptionIndex = () => setFocusedOptionIndex(-1)

  const resetFilteredValue = () => {
    setFilteredValue('')
    resetToOriginalOptions()
  }

  const isOverflown = useCallback(element => {
    // var(--sz-56, 56px)
    // const defaultSelectedHeight = +styles.defaultSelectedHeight.split(' ')[1].slice(0, 2)
    return element && element.scrollHeight > defaultSelectedHeight
  }, [])

  useClickOutsideListener(() => {
    closeMenu()
    getOffTypeMode()
    resetFocusedOptionIndex()
  }, containerRef)

  useEffect(() => {
    if (!multiple || !isSelectedShownInHeader) return
    if (selectedOptions.length && isOverflown(selectedContainerRef.current)) {
      selectedContainerRef.current.style.height = 'auto'
      selectedContainerRef.current.style.paddingBottom = '8px'
    } else {
      selectedContainerRef.current.style.height = styles.defaultSelectedHeight
      selectedContainerRef.current.style.paddingBottom = '2px'
    }
  }, [selectedOptions, multiple, isSelectedShownInHeader, isOverflown])

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
      resetToOriginalOptions()
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
      closeMenu()
      resetFocusedOptionIndex()
    }
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
        if (focusedOptionIndex === -1) return
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

  const renderValues = () => {
    if (isTypeMode && (!multiple || !isSelectedShownInHeader)) return null
    if (!selectedOptions.length) {
      if (isTypeMode) return null
      return (
        <p className={styles.placeholder} onClick={getIntoTypeMode}>
          {placeholder}
        </p>
      )
    }

    if (multiple && isSelectedShownInHeader) {
      return selectedOptions.map(({ [displayValue]: value }, index) => (
        <button
          className={classNames(styles.selectedItem, {
            [styles.spacingTop]: isSelectedShownInHeader && multiple,
          })}
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
          {!multiple
            ? selectedOptions[0][displayValue]
            : `${selectedOptions.length} ${getTranslation('itemsSelected')}`}
        </p>
      )
    }
  }

  const renderDeleteButton = () => (
    <button
      className={classNames(styles.deleteButton, {
        [styles.spacingTop]: isSelectedShownInHeader && multiple,
      })}
      onClick={emptySelectedOptions}
    >
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
    if (!isSelectedShownInHeader) return placeholder
    return selectedOptions.length ? undefined : placeholder
  }

  const determineInputWidth = () => {
    const containerWidth = valuesContainerRef.current.offsetWidth
    if (!multiple) return `${containerWidth}px`
    return selectedOptions.length === 0 ? `${containerWidth}px` : ''
  }

  const handleInputKeyPress = () =>
    (inputRef.current.style.width = `${
      (filteredValue.length
        ? filteredValue.length
        : inputRef.current.placeholder.length) + 5
    }ch`)

  const renderHeaderContainer = () => (
    <div className={styles.selectedContainer} ref={selectedContainerRef}>
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
              ref={inputRef}
              style={{ width: determineInputWidth() }}
              onKeyPress={handleInputKeyPress}
              onKeyUp={handleInputKeyPress}
            />
          )}
        </div>
      </div>
      <div className={styles.icons}>
        {filteredValue.length > 0 && (
          <IconButton
            variant='ghost'
            onClick={resetFilteredValue}
            aria-label='clear input'
            disabled={isDisabled}
            className={styles.iconButton}
          >
            <CancelFilledIcon />
          </IconButton>
        )}
        <IconButton
          variant='ghost'
          onClick={toggleMenu}
          aria-label='toggle menu'
          disabled={isDisabled}
          className={classNames(styles.iconButton, {
            [styles.rotated]: showMenu,
          })}
        >
          <ArrowUp />
        </IconButton>
      </div>
    </div>
  )

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
  isSelectedShownInHeader: true,
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
  /** Whether to show multiple selected options in header. */
  isSelectedShownInHeader: propTypes.bool,
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
