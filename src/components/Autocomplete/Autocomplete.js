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
import { AutocompleteItem } from './AutocompleteItem'
import { EmptyAutocompleteMenu } from './EmptyAutocompleteMenu'
import {
  useClickOutsideListener,
  usePrevious,
  useCombinedRefs,
  useIsOverflowing,
} from '../../hooks'
import { useComponentTranslation } from '../../hooks/UseComponentTranslation'
import { Tooltip } from '../Tooltip'
import { AutocompleteVirtualizedList } from './AutocompleteVirtualizedList'
import styles from './Autocomplete.module.scss'

const menuItemHeight = 56

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
      defaultValue,
      displayValue,
      keyValue,
      className,
      onSelect,
      placeholder,
      label,
      disabled,
      onMenuOpen,
      onMenuClose,
      noOptionsMessage,
      valueRender,
      maxMenuHeight,
      autoHeight,
      onSearch,
      loading,
    },
    ref,
  ) => {
    const [isTypeMode, setIsTypeMode] = useState(false)
    const [filteredValue, setFilteredValue] = useState('')
    const [selected, setSelected] = useState(defaultValue)
    const [showMenu, setShowMenu] = useState(false)
    const [focusedOptionIndex, setFocusedOptionIndex] = useState(-1)
    const [isMenuPositionedUpwards, setIsMenuPositionedUpwards] = useState(null)
    const containerRef = useRef(null)
    const menuRef = useRef(null)
    const inputRef = useRef(null)
    const selectedContainerRef = useRef(null)
    const valuesContainerRef = useRef(null)
    const [selectedValueElement, setSelectedValueElement] = useState(null)
    const { getComponentTranslation } = useComponentTranslation()
    const AutocompleteTranslations = getComponentTranslation('autocomplete')

    const menuHeight = Math.min(
      options.length * menuItemHeight,
      autoHeight ? Infinity : maxMenuHeight,
    )

    useImperativeHandle(
      ref,
      () => ({
        setOptions: () => {
          setFilteredValue('')
        },
      }),
      [],
    )

    const selectedElementContent = selected?.[displayValue]

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

    const getIntoTypeMode = () => {
      if (disabled) return
      setIsTypeMode(true)
      !showMenu && openMenu()
    }

    const getOffTypeMode = () => {
      isTypeMode && setIsTypeMode(false)
      filteredValue.length && setFilteredValue('')
    }

    const resetFocusedOptionIndex = () => setFocusedOptionIndex(-1)

    const resetFilteredValue = () => {
      setFilteredValue('')
    }

    useClickOutsideListener(() => {
      closeMenu()
      getOffTypeMode()
      resetFocusedOptionIndex()
    }, containerRef)

    const prevProps = usePrevious({ defaultValue })

    useEffect(() => {
      if (
        JSON.stringify(prevProps?.defaultValue) !== JSON.stringify(defaultValue)
      ) {
        setSelected(defaultValue)
      }
    }, [defaultValue, prevProps])

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

    const handleFilterChange = ({ target: { value } }) => {
      setFilteredValue(value)
      onSearch(value)
    }

    const handleItemClick = clickedOption => {
      if (!clickedOption || clickedOption.disabled) return

      getOffTypeMode()
      closeMenu()
      resetFocusedOptionIndex()

      setSelected(clickedOption)
      onSelect(clickedOption)
    }

    const emptySelected = () => {
      setSelected(null)
      onSelect(null)
    }

    const selectOption = optionIndex => handleItemClick(options[optionIndex])

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
          emptySelected()
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
      if (isTypeMode) return null
      if (!selected) {
        if (isTypeMode) return null
        return (
          <p className={styles.placeholder} onClick={getIntoTypeMode}>
            {placeholder || AutocompleteTranslations.selectOption}
          </p>
        )
      }

      return (
        <p
          className={styles.selectedValue}
          onClick={getIntoTypeMode}
          ref={setSelectedValueElement}
        >
          {selectedElementContent}
        </p>
      )
    }

    const renderButtons = () => (
      <div className={styles.icons}>
        {loading && (
          <div className={classNames(styles.iconButton, styles.loadingIcon)}>
            <Loader />
          </div>
        )}
        <IconButton
          data-testid='autocomplete-delete-btn'
          disabled={disabled}
          onClick={filteredValue.length ? resetFilteredValue : emptySelected}
          className={classNames(styles.iconButton, styles.clearBtn)}
          variant='ghost'
          style={{
            visibility: filteredValue.length || selected ? 'visible' : 'hidden',
          }}
        >
          <TimesCircleFilled />
        </IconButton>
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

    const determineInputPlaceholder = () =>
      selected ? selected[displayValue] : placeholder

    const determineInputWidth = () =>
      `${valuesContainerRef.current.offsetWidth}px`

    const handleInputKeyPress = () =>
      (inputRef.current.style.width = `${
        (filteredValue.length
          ? filteredValue.length
          : inputRef.current.placeholder.length) + 5
      }ch`)

    const renderHeaderContainer = () => (
      <div
        className={classNames(styles.selectedContainer, {
          [styles.isMenuOpen]: showMenu,
        })}
        ref={selectedContainerRef}
      >
        <label className={classNames({ [styles.labelColor]: showMenu })}>
          {label || AutocompleteTranslations.label}
        </label>
        <div
          className={styles.selectedContentContainer}
          onClick={getIntoTypeMode}
          onMouseDown={getIntoTypeMode}
        >
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
        {renderButtons()}
      </div>
    )

    const renderOption = (option, index) => (
      <AutocompleteItem
        option={option}
        displayValue={displayValue}
        key={option[keyValue]}
        onClick={() => handleItemClick(option)}
        isSelected={selected?.[keyValue] === option[keyValue]}
        isFocusedByKeyboard={isTypeMode && index === focusedOptionIndex}
        valueRender={valueRender}
      />
    )

    const renderOptions = () => (
      <div
        className={classNames(styles.menuContainer, {
          [styles.isPositionedUpwards]: isMenuPositionedUpwards,
        })}
        ref={menuRef}
        style={{ height: options.length ? `${menuHeight}px` : undefined }}
      >
        {!options.length && filteredValue && !loading ? (
          <EmptyAutocompleteMenu
            noOptionsMessage={
              noOptionsMessage || AutocompleteTranslations.noResultsFound
            }
            searchValue={filteredValue}
          />
        ) : (
          <AutocompleteVirtualizedList
            menuHeight={menuHeight}
            options={options}
            rowHeight={menuItemHeight}
            renderRow={renderOption}
            focusedOptionIndex={focusedOptionIndex}
          />
        )}
      </div>
    )

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
          content={selectedElementContent}
          show={useIsOverflowing({
            current: selectedValueElement,
          })}
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
  defaultValue: null,
  displayValue: 'value',
  keyValue: 'id',
  disabled: false,
  onMenuClose: () => {},
  onMenuOpen: () => {},
  onSelect: () => {},
  onSearch: () => {},
  maxMenuHeight: 240,
}

Autocomplete.propTypes = {
  /** Autocomplete options. */
  options: propTypes.arrayOf(propTypes.object),
  /** Default value for the autocomplete. */
  defaultValue: propTypes.object,
  /** Value to display from option. Default is 'value'. */
  displayValue: propTypes.string,
  /** Unique key of the option. Default is 'id'. */
  keyValue: propTypes.string,
  /** Set max menu height. Default is 240. */
  maxMenuHeight: propTypes.number,
  /** Set height of menu to auto. */
  autoHeight: propTypes.bool,
  /** Called when selected value has changed. */
  onSelect: propTypes.func,
  /** Called when input value has changed. */
  onSearch: propTypes.func,
  /** For css customization. */
  className: propTypes.string,
  /** Placeholder to show when no value is selected. */
  placeholder: propTypes.string,
  /** Label to add information about  the autocomplete. */
  label: propTypes.string,
  /** Set autocomplete to disabled if true. */
  disabled: propTypes.bool,
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
