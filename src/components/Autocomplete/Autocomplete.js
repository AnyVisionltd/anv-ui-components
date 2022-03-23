import React, {
  useImperativeHandle,
  useState,
  useRef,
  memo,
  useEffect,
  useCallback,
} from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import { ArrowUp, TimesCircleFilled, Loader } from '@anyvision/anv-icons'
import keymap from '../../utils/enums/keymap'
import { findScrollerNodeBottom } from '../../utils'
import { InputBase, IconButton } from '../../index'
import { DropdownItem } from './DropdownItem'
import { EmptyDropdownMenu } from './EmptyDropdownMenu'
import {
  useClickOutsideListener,
  usePrevious,
  useCombinedRefs,
  useIsOverflowing,
} from '../../hooks'
import languageService from '../../services/language'
import { Tooltip } from '../Tooltip'
import { DropdownVirtualizedList } from './DropdownVirtualizedList'
import styles from './Autocomplete.module.scss'

const menuItemHeight = 56
const defaultSelectedHeight = 56
const getTranslation = path => languageService.getTranslation(`${path}`)

const getMenuPlacement = ({ menuHeight, containerElement }) => {
  if (!containerElement) return
  const { bottom: containerBottom } = containerElement.getBoundingClientRect()
  if (document.body.clientHeight - containerBottom > menuHeight) return false

  const scrollerNodeBottom = findScrollerNodeBottom(containerElement)
  return scrollerNodeBottom - containerBottom < menuHeight
}

const Autocomplete = React.forwardRef(
  (
    {
      options,
      defaultOption,
      displayValue,
      keyValue,
      className,
      onChange,
      placeholder,
      label,
      disabled,
      onMenuOpen,
      onMenuClose,
      noOptionsMessage,
      valueRender,
      maxMenuHeight,
      autoHeight,
      onSearchChange,
      loading,
    },
    ref,
  ) => {
    const [filteredValue, setFilteredValue] = useState('')
    const [selectedOption, setSelectedOption] = useState(defaultOption)
    const [showMenu, setShowMenu] = useState(false)
    const [focusedOptionIndex, setFocusedOptionIndex] = useState(-1)
    const [isMenuPositionedUpwards, setIsMenuPositionedUpwards] = useState(null)
    const containerRef = useRef(null)
    const menuRef = useRef(null)
    const inputRef = useRef(null)
    const selectedContainerRef = useRef(null)
    const inputWrapperRef = useRef(null)
    const [selectedValueElement, setSelectedValueElement] = useState(null)

    const menuHeight = Math.min(
      options.length * menuItemHeight,
      autoHeight ? Infinity : maxMenuHeight,
    )

    useImperativeHandle(
      ref,
      () => ({
        setOptions: newOptions => {
          setFilteredValue('')
        },
      }),
      [],
    )

    const selectedElementContent = selectedOption?.[displayValue]

    const openMenu = () => {
      if (showMenu || disabled) return
      setShowMenu(true)
      onMenuOpen()
    }

    const closeMenu = () => {
      if (!showMenu) return
      setShowMenu(false)
      onMenuClose()
    }

    const toggleMenu = () => (showMenu ? closeMenu() : openMenu())

    const resetFocusedOptionIndex = () => setFocusedOptionIndex(-1)

    const resetFilteredValue = () => {
      setFilteredValue('')
    }

    useClickOutsideListener(() => {
      closeMenu()
      resetFocusedOptionIndex()
    }, containerRef)

    const prevProps = usePrevious({ defaultOption })

    useEffect(() => {
      if (
        JSON.stringify(prevProps?.defaultOption) !==
        JSON.stringify(defaultOption)
      ) {
        setSelectedOption(defaultOption)
      }
    }, [defaultOption, prevProps])

    const handleMenuPlacement = useCallback(
      node => {
        if (
          isMenuPositionedUpwards === null ||
          prevProps?.options?.length !== options.length
        ) {
          const menuHeight = Math.min(
            maxMenuHeight,
            options.length * menuItemHeight,
          )
          setIsMenuPositionedUpwards(
            getMenuPlacement({ menuHeight, containerElement: node }),
          )
        }
      },
      [isMenuPositionedUpwards, options, prevProps, maxMenuHeight],
    )

    const focusOption = direction => {
      if (!showMenu || !options.length) return
      if (direction === 'up') {
        const curFocusedOption = focusedOptionIndex - 1
        setFocusedOptionIndex(
          curFocusedOption < 0 ? options.length - 1 : curFocusedOption,
        )
      } else if (direction === 'down') {
        const curFocusedOption = focusedOptionIndex + 1
        setFocusedOptionIndex(
          curFocusedOption >= options.length ? 0 : curFocusedOption,
        )
      }
    }

    const handleFilterChange = e => {
      const value = e.target.value
      openMenu()
      setFilteredValue(value)
      onSearchChange(value)
    }

    const handleItemClick = clickedOption => {
      if (!clickedOption || clickedOption.disabled) return

      const { [displayValue]: value } = clickedOption

      closeMenu()
      resetFocusedOptionIndex()
      setSelectedValueElement(inputRef)
      setSelectedOption(clickedOption)
      setFilteredValue(value)
      onChange(clickedOption)
    }

    useEffect(() => {}, [filteredValue])

    const emptySelectedOptions = () => {
      setSelectedOption(null)
      onChange(null)
      setFilteredValue('')
    }

    const selectOption = optionIndex => handleItemClick(options[optionIndex])

    const handleKeyDown = e => {
      switch (e.keyCode) {
        case keymap.ENTER:
          if (focusedOptionIndex === -1) return
          selectOption(focusedOptionIndex)
          break
        case keymap.ESCAPE:
          closeMenu()
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

    const renderButtons = () => (
      <div className={styles.icons}>
        {}
        {loading && (
          <div className={classNames(styles.iconButton, styles.loadingIcon)}>
            <Loader />
          </div>
        )}
        {selectedOption && (
          <IconButton
            onClick={emptySelectedOptions}
            className={classNames(
              styles.iconButton,
              styles.clearBtn,
              styles.clearSelected,
            )}
            variant='ghost'
          >
            <TimesCircleFilled />
          </IconButton>
        )}
        {!loading && !selectedOption && (
          <IconButton
            variant='ghost'
            onClick={resetFilteredValue}
            aria-label='clear input'
            disabled={disabled}
            className={classNames(styles.iconButton, styles.clearBtn)}
            style={{ visibility: filteredValue.length ? 'visible' : 'hidden' }}
          >
            <TimesCircleFilled />
          </IconButton>
        )}
        <IconButton
          variant='ghost'
          onClick={toggleMenu}
          aria-label='toggle menu'
          disabled={disabled}
          className={classNames(styles.iconButton, {
            [styles.rotated]: !showMenu,
          })}
        >
          <ArrowUp />
        </IconButton>
      </div>
    )

    const handleInputKeyPress = () =>
      (inputRef.current.style.width = `${
        (filteredValue.length
          ? filteredValue.length
          : inputRef.current.placeholder.length) + 5
      }ch`)

    const handleInputFocus = e => {
      const value = e.target.value
      openMenu()
      onSearchChange(value)
    }

    const handleInputBlur = () => {
      if (selectedOption) {
        setFilteredValue(selectedOption.value)
      }
    }

    const renderHeaderContainer = () => (
      <div
        className={classNames(styles.selectedContainer, {
          [styles.isMenuOpen]: showMenu,
        })}
        ref={selectedContainerRef}
      >
        <label className={classNames({ [styles.labelColor]: showMenu })}>
          {label}
        </label>
        <div className={styles.selectedContentContainer} ref={inputWrapperRef}>
          <InputBase
            value={filteredValue}
            onChange={handleFilterChange}
            className={styles.inputBase}
            onKeyDown={handleKeyDown}
            onKeyPress={handleInputKeyPress}
            onKeyUp={handleInputKeyPress}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            ref={inputRef}
            placeholder={placeholder}
          />
        </div>
        {renderButtons()}
      </div>
    )

    const renderOption = (option, index) => (
      <DropdownItem
        option={option}
        displayValue={displayValue}
        key={option[keyValue]}
        onClick={() => handleItemClick(option)}
        isSelected={selectOption[keyValue] === option[keyValue]}
        isFocusedByKeyboard={index === focusedOptionIndex}
        valueRender={valueRender}
      />
    )

    const renderOptions = () =>
      !loading && (
        <div
          className={classNames(styles.menuContainer, {
            [styles.isPositionedUpwards]: isMenuPositionedUpwards,
          })}
          ref={menuRef}
          style={{
            height: options.length ? `${menuHeight}px` : undefined,
          }}
        >
          {!loading && filteredValue && !options.length ? (
            <EmptyDropdownMenu
              noOptionsMessage={noOptionsMessage}
              searchValue={filteredValue}
            />
          ) : (
            <DropdownVirtualizedList
              menuHeight={menuHeight}
              options={options}
              rowHeight={menuItemHeight}
              renderRow={renderOption}
              focusedOptionIndex={focusedOptionIndex}
            />
          )}
        </div>
      )

    const showTooltip = ref => {
      if (ref && ref.current) {
        return ref.current.clientWidth < ref.current.scrollWidth
      }
      return false
    }

    return (
      <div
        className={classNames(
          styles.container,
          disabled && styles.isDisabled,
          className,
        )}
        ref={useCombinedRefs(containerRef, handleMenuPlacement)}
      >
        <Tooltip
          content={selectedOption?.[displayValue]}
          show={showTooltip(inputRef)}
        >
          {renderHeaderContainer()}
        </Tooltip>
        {showMenu && renderOptions()}
      </div>
    )
  },
)

Autocomplete.defaultProps = {
  options: [],
  defaultValues: [],
  placeholder: getTranslation('selectOption'),
  label: getTranslation('label'),
  displayValue: 'value',
  keyValue: 'id',
  isSearchable: true,
  disabled: false,
  noOptionsMessage: getTranslation('noResultsFound'),
  onMenuClose: () => {},
  onMenuOpen: () => {},
  onChange: () => {},
  maxMenuHeight: 240,
}

Autocomplete.propTypes = {
  /** Dropdown options. */
  options: propTypes.arrayOf(propTypes.object),
  /** Defauly values for the dropdown. */
  defaultValues: propTypes.arrayOf(propTypes.object),
  /** Value to display from option. Default is 'value'. */
  displayValue: propTypes.string,
  /** Unique key of the option. Default is 'id'. */
  keyValue: propTypes.string,
  /** Set max menu height. Default is 240. */
  maxMenuHeight: propTypes.number,
  /** Set height of menu to auto. */
  autoHeight: propTypes.bool,
  /** Called when max selected options is exceeded. */
  onExceedMaxSelected: propTypes.func,
  /** Called when selected value has changed. */
  onChange: propTypes.func,
  /** Called when input value has changed. */
  onSearch: propTypes.func,
  /** Whether to enable search functionality. */
  isSearchable: propTypes.bool,
  /** For css customization. */
  className: propTypes.string,
  /** Placeholder to show when no value is selected. */
  placeholder: propTypes.string,
  /** Label to add information about  the dropdown. */
  label: propTypes.string,
  /** Set dropdown to disabled if true. */
  disabled: propTypes.bool,
  /** Wether dropdown can be empty or not. */
  canBeEmpty: propTypes.bool,
  /** Called when menu is opened. */
  onMenuOpen: propTypes.func,
  /** Called when menu is closed. */
  onMenuClose: propTypes.func,
  /** Custom value renderer function. */
  valueRender: propTypes.func,
  /** Text / component to display when there are no options. */
  noOptionsMessage: propTypes.oneOfType([propTypes.string, propTypes.func]),
}

export default memo(Autocomplete)
