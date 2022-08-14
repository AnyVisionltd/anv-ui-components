import React, {
  useImperativeHandle,
  useState,
  useRef,
  memo,
  useEffect,
  useCallback,
  useMemo,
} from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import { ArrowUp, TimesThick, TimesCircleFilled } from '@anyvision/anv-icons'
import { useComponentTranslation } from '../../hooks/UseComponentTranslation'
import keymap from '../../utils/enums/keymap'
import { findScrollerNodeBottom } from '../../utils'
import { InputBase, IconButton, useFormProvider, Checkbox } from '../../index'
import { DropdownItem } from './DropdownItem'
import { MenuSelect } from '../MenuSelect'
import { EmptyDropdownMenu } from './EmptyDropdownMenu'
import {
  useClickOutsideListener,
  usePrevious,
  useCombinedRefs,
  useIsOverflowing,
} from '../../hooks'
import { Tooltip } from '../Tooltip'
import { DropdownVirtualizedList } from './DropdownVirtualizedList'
import styles from './Dropdown.module.scss'

const DEFAULT_SELECTED_CONTAINER_HEIGHT = 56

const getMenuPlacement = ({ menuHeight, containerElement }) => {
  if (!containerElement) return
  const { bottom: containerBottom } = containerElement.getBoundingClientRect()
  if (document.body.clientHeight - containerBottom > menuHeight) return false

  const scrollerNodeBottom = findScrollerNodeBottom(containerElement)
  return scrollerNodeBottom - containerBottom < menuHeight
}

const Dropdown = React.forwardRef(
  (
    {
      message,
      error,
      view,
      inPortal,
      inPortalMenuSize,
      options,
      defaultValues,
      displayValue,
      keyValue,
      className,
      menuClassName,
      bulkSelectionClassName,
      onChange,
      placeholder,
      label,
      disabled,
      onMenuOpen,
      onMenuClose,
      onExceedMaxSelected,
      multiple,
      maxSelected,
      noOptionsMessage,
      isSearchable,
      isSelectedShownInHeader,
      valueRender,
      optionRender,
      canBeEmpty,
      maxMenuHeight,
      autoHeight,
      onSearch,
      messageRef,
      isUpdateOptionsOnOptionsContentChange,
      addBulkSelectionButton,
      selfControlled,
      menuItemHeight,
    },
    ref,
  ) => {
    const { getComponentTranslation } = useComponentTranslation()
    const DropDownTranslations = getComponentTranslation('dropDown')
    const { isView } = useFormProvider({ view })
    const [isTypeMode, setIsTypeMode] = useState(false)
    const [filteredValue, setFilteredValue] = useState('')
    const [shownOptions, setShownOptions] = useState([...options])
    const [selectedOptions, setSelectedOptions] = useState({
      items: [...defaultValues],
      excludeMode: false,
    })
    const [showMenu, setShowMenu] = useState(false)
    const [focusedOptionIndex, setFocusedOptionIndex] = useState(-1)
    const [isMenuPositionedUpwards, setIsMenuPositionedUpwards] = useState(null)
    const containerRef = useRef(null)
    const menuRef = useRef(null)
    const inputRef = useRef(null)
    const selectedContainerRef = useRef(null)
    const valuesContainerRef = useRef(null)
    const [selectedValueElement, setSelectedValueElement] = useState(null)
    const [menuSelectedItems, setMenuSelectedItems] = useState(
      multiple
        ? defaultValues.map(option => option.id)
        : defaultValues.length
        ? defaultValues[0]
        : '',
    )

    const handleRemoveAllSelectedItems = () => {
      setMenuSelectedItems([])
      onChange([])
    }

    const optionCallback = option => {
      if (multiple) {
        const updatedValues = (menuSelectedItems.find(id => option.id === id)
          ? menuSelectedItems.filter(id => option.id !== id)
          : [...menuSelectedItems, option.id]
        ).map(id => options.find(item => item.id === id))

        setMenuSelectedItems(prev => {
          if (prev.find(id => option.id === id)) {
            return prev.filter(id => option.id !== id)
          }
          return [...prev, option.id]
        })
        onChange(updatedValues)
      } else {
        setMenuSelectedItems(option)
        onChange([option])
      }
    }

    const menuOptions = options.map(option => {
      return {
        key: option.id,
        element: option[displayValue],
        isSelected: multiple
          ? !!menuSelectedItems.find(id => option.id === id)
          : menuSelectedItems.id === option.id,
        callback: () => {
          optionCallback(option)
        },
      }
    })

    const areAllOptionsSelected = useMemo(() => {
      if (!addBulkSelectionButton) return
      if (selfControlled) {
        return (
          selectedOptions.items.length ===
          options.filter(({ disabled }) => !disabled).length
        )
      }
      const allSelectedInExcludeMode =
        selectedOptions.excludeMode && !selectedOptions.items.length
      return allSelectedInExcludeMode
    }, [
      addBulkSelectionButton,
      options,
      selectedOptions.excludeMode,
      selectedOptions.items.length,
      selfControlled,
    ])

    const selectedOptionsSet = new Set([
      ...selectedOptions.items.map(({ [keyValue]: id }) => id),
    ])
    const menuHeight = Math.min(
      shownOptions.length * menuItemHeight,
      autoHeight ? Infinity : maxMenuHeight,
    )

    useImperativeHandle(
      ref,
      () => ({
        setOptions: newOptions => {
          setFilteredValue('')
          setShownOptions([...newOptions])
        },
      }),
      [],
    )

    const selectedElementContent = useMemo(() => {
      if (!multiple) {
        return selectedOptions.items?.[0]?.[displayValue]
      }
      const { excludeMode } = selectedOptions
      if (excludeMode) {
        return `${DropDownTranslations.multiple} ${DropDownTranslations.itemsSelected}`
      }

      const selectedOptionsAmount = selectedOptions.items.length
      const selectedTranslation =
        selectedOptionsAmount === 1
          ? DropDownTranslations.itemSelected
          : DropDownTranslations.itemsSelected
      return `${selectedOptionsAmount} ${selectedTranslation}`
    }, [DropDownTranslations, displayValue, multiple, selectedOptions])

    const resetToOriginalOptions = () => {
      if (selfControlled) {
        if (shownOptions.length !== options.length) {
          setShownOptions(options)
        }
      } else {
        onSearch?.('')
      }
    }

    const openMenu = () => {
      if (showMenu || disabled || isView) return
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
      if (disabled) return
      isSearchable && setIsTypeMode(true)
      !showMenu && openMenu()
    }

    const getOffTypeMode = () => {
      isTypeMode && setIsTypeMode(false)
      if (filteredValue.length) {
        setFilteredValue('')
        onSearch?.('')
      }
    }

    const resetFocusedOptionIndex = () => setFocusedOptionIndex(-1)

    const resetFilteredValue = e => {
      e.stopPropagation()
      setFilteredValue('')
      resetToOriginalOptions()
    }

    const isOverflown = useCallback(
      element =>
        element && element.scrollHeight > DEFAULT_SELECTED_CONTAINER_HEIGHT,
      [],
    )

    useClickOutsideListener(() => {
      closeMenu()
      getOffTypeMode()
      resetFocusedOptionIndex()
    }, containerRef)

    const prevProps = usePrevious({ options, defaultValues })

    const handlePrevOptionsChange = useCallback(
      prevOptions => {
        if (!selfControlled) {
          if (prevOptions !== options) {
            setShownOptions([...options])
          }
          return
        }

        if (isUpdateOptionsOnOptionsContentChange) {
          if (JSON.stringify(prevOptions) !== JSON.stringify(options)) {
            setShownOptions([...options])
          }
          return
        }
        if (prevOptions?.length !== options.length) {
          setShownOptions([...options])
        }
      },
      [isUpdateOptionsOnOptionsContentChange, options, selfControlled],
    )

    useEffect(() => {
      if (
        JSON.stringify(prevProps?.defaultValues) !==
        JSON.stringify(defaultValues)
      ) {
        setSelectedOptions(prev => ({ ...prev, items: [...defaultValues] }))
      }
      handlePrevOptionsChange(prevProps?.options)
    }, [options, defaultValues, prevProps, handlePrevOptionsChange])

    useEffect(() => {
      if (
        !multiple ||
        !isSelectedShownInHeader ||
        !selectedContainerRef.current
      )
        return
      if (
        selectedOptions.items.length &&
        isOverflown(selectedContainerRef.current)
      ) {
        selectedContainerRef.current.style.height = 'auto'
        selectedContainerRef.current.style.paddingBottom = '8px'
      } else {
        selectedContainerRef.current.style.height = styles.defaultSelectedHeight
        selectedContainerRef.current.style.paddingBottom = '2px'
      }
    }, [selectedOptions, multiple, isSelectedShownInHeader, isOverflown])

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
      [
        isMenuPositionedUpwards,
        options,
        prevProps,
        maxMenuHeight,
        menuItemHeight,
      ],
    )

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
      if (onSearch || !selfControlled) {
        onSearch?.(value)
        setSelectedOptions({ items: [], excludeMode: false })
        return
      }

      if (!value || !value.trim().length) {
        resetToOriginalOptions()
        return
      }

      const filteredOptions = options.filter(option =>
        option[displayValue].toLowerCase().startsWith(value.toLowerCase()),
      )
      setShownOptions(filteredOptions)
    }

    const toggleSelectAll = () => {
      const newSelectedOptions = { items: [] }
      if (selfControlled) {
        newSelectedOptions.items = !selectedOptions.items.length
          ? options.filter(({ disabled }) => !disabled)
          : []
      } else {
        newSelectedOptions.excludeMode =
          !areAllOptionsSelected && !selectedOptions.items.length
      }
      setSelectedOptions(newSelectedOptions)
      onChange(selfControlled ? newSelectedOptions.items : newSelectedOptions)
    }

    const handleItemClick = clickedOption => {
      if (!clickedOption || clickedOption.disabled) return
      if (maxSelected && maxSelected === selectedOptions.items.length) {
        return onExceedMaxSelected()
      }
      const { [keyValue]: key } = clickedOption
      const isFoundInDropdown = selectedOptionsSet.has(key)
      let newOptions
      if (multiple) {
        if (isFoundInDropdown) {
          newOptions = selectedOptions.items.filter(
            option => option[keyValue] !== key,
          )
        } else {
          newOptions = [...selectedOptions.items, clickedOption]
        }
        resetToOriginalOptions()
      } else {
        if (isFoundInDropdown) {
          if (canBeEmpty) {
            newOptions = []
          } else {
            return
          }
        } else {
          newOptions = [clickedOption]
        }
        getOffTypeMode()
        closeMenu()
        resetFocusedOptionIndex()
      }

      setSelectedOptions(prev => ({ ...prev, items: newOptions }))
      onChange(
        selfControlled ? newOptions : { ...selectedOptions, items: newOptions },
      )
    }

    const handleRemoveOption = optionIndex => {
      const newOptions = [...selectedOptions.items]
      newOptions.splice(optionIndex, 1)
      setSelectedOptions(prev => ({ ...prev, items: newOptions }))
      onChange(
        selfControlled ? newOptions : { ...selectedOptions, items: newOptions },
      )
    }

    const popLastValue = () => {
      const newOptions = selectedOptions.items.slice(
        0,
        selectedOptions.items.length - 1,
      )
      setSelectedOptions(prev => ({ ...prev, items: newOptions }))
      onChange(
        selfControlled ? newOptions : { ...selectedOptions, items: newOptions },
      )
    }

    const emptySelectedOptions = () => {
      setSelectedOptions(prev => ({ ...prev, items: [] }))
      onChange(selfControlled ? [] : { ...selectedOptions, items: [] })
    }

    const selectOption = optionIndex =>
      handleItemClick(shownOptions[optionIndex])

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
          if (
            multiple &&
            isSelectedShownInHeader &&
            selectedOptions.items.length
          ) {
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
      const { items, excludeMode } = selectedOptions
      if (!items.length && !excludeMode) {
        if (isTypeMode) return null
        return (
          <p className={styles.placeholder} onClick={getIntoTypeMode}>
            {placeholder || DropDownTranslations.selectOption}
          </p>
        )
      }

      if (multiple && isSelectedShownInHeader) {
        return items.map(({ [displayValue]: value }, index) => (
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
          <p
            className={styles.selectedValue}
            onClick={getIntoTypeMode}
            ref={setSelectedValueElement}
          >
            {selectedElementContent}
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
        {selectedOptions.items.length}
        <span>
          <TimesThick />
        </span>
      </button>
    )

    const renderButtons = () => (
      <div className={styles.icons}>
        <IconButton
          variant='ghost'
          onClick={resetFilteredValue}
          aria-label='clear input'
          disabled={disabled}
          className={styles.iconButton}
          style={{ visibility: filteredValue.length ? 'visible' : 'hidden' }}
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

    const determineInputPlaceholder = () => {
      if (!multiple) {
        return selectedOptions.items.length
          ? selectedOptions.items[0][displayValue]
          : placeholder
      }
      if (!isSelectedShownInHeader) return placeholder
      return selectedOptions.items.length ? undefined : placeholder
    }

    const determineInputWidth = () => {
      const containerWidth = valuesContainerRef.current.offsetWidth
      if (!multiple) return `${containerWidth}px`
      return selectedOptions.items.length === 0 ? `${containerWidth}px` : ''
    }

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
          [styles.isView]: isView,
        })}
        ref={selectedContainerRef}
      >
        <label className={classNames({ [styles.labelColor]: showMenu })}>
          {label || DropDownTranslations.label}
        </label>
        <div
          className={styles.selectedContentContainer}
          onClick={getIntoTypeMode}
        >
          {selectedOptions.items.length > 0 && multiple && renderDeleteButton()}
          <div className={styles.valuesContainer} ref={valuesContainerRef}>
            {renderValues()}
            {isTypeMode && (
              <InputBase
                autoFocus
                value={filteredValue}
                onChange={handleFilterChange}
                className={classNames(styles.inputBase, {
                  [styles.spacingTop]: isSelectedShownInHeader && multiple,
                })}
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
        {!isView && renderButtons()}
      </div>
    )

    const renderBulkSelectionButton = () => (
      <div
        className={classNames(
          styles.bulkSelectContainer,
          bulkSelectionClassName,
        )}
      >
        <Checkbox
          checked={areAllOptionsSelected}
          onChange={toggleSelectAll}
          className={styles.checkbox}
          id='bulk-select-dropdown'
        />
        <label
          htmlFor='bulk-select-dropdown'
          className={styles.bulkSelectLabel}
        >
          {DropDownTranslations.selectAllNone}
        </label>
      </div>
    )

    const handleIsOptionSelected = optionKey => {
      if (selectedOptions.excludeMode) {
        return !selectedOptionsSet.has(optionKey)
      }
      return selectedOptionsSet.has(optionKey)
    }

    const renderOption = (option, index) => (
      <DropdownItem
        option={option}
        displayValue={displayValue}
        multiple={multiple}
        key={option[keyValue]}
        onClick={() => handleItemClick(option)}
        isSelected={handleIsOptionSelected(option[keyValue])}
        isFocusedByKeyboard={isTypeMode && index === focusedOptionIndex}
        valueRender={valueRender}
        optionRender={optionRender}
      />
    )

    const renderOptions = () => (
      <div
        className={classNames(
          styles.menuContainer,
          {
            [styles.isPositionedUpwards]: isMenuPositionedUpwards,
          },
          menuClassName,
        )}
        ref={menuRef}
      >
        {!shownOptions.length ? (
          <EmptyDropdownMenu
            noOptionsMessage={
              noOptionsMessage || DropDownTranslations.noResultsFound
            }
            searchValue={filteredValue}
          />
        ) : (
          <>
            {addBulkSelectionButton && renderBulkSelectionButton()}
            <DropdownVirtualizedList
              menuHeight={menuHeight}
              options={shownOptions}
              rowHeight={menuItemHeight}
              renderRow={renderOption}
              focusedOptionIndex={focusedOptionIndex}
            />
          </>
        )}
      </div>
    )

    const renderInPortalMenu = () => {
      return (
        <MenuSelect
          menuContainerId={keyValue}
          preferOpenDirection={'bottom-start'}
          items={menuOptions}
          selectedData={
            multiple ? menuSelectedItems : menuSelectedItems[displayValue]
          }
          disabled={disabled}
          isMultiSelect={multiple}
          removeAll={multiple && handleRemoveAllSelectedItems}
          toggleCallback={onMenuClose}
          size={inPortalMenuSize}
          label={label}
        />
      )
    }

    const dropdownRef = useCombinedRefs(containerRef, handleMenuPlacement)
    const showTooltip = useIsOverflowing({
      current: selectedValueElement,
    })

    if (inPortal) {
      return renderInPortalMenu()
    }

    return (
      <div
        className={classNames(
          styles.container,
          {
            [styles.isDisabled]: disabled,
            [styles.error]: error,
          },
          className,
        )}
        ref={dropdownRef}
      >
        <Tooltip content={selectedElementContent} show={showTooltip}>
          {renderHeaderContainer()}
        </Tooltip>
        {showMenu && renderOptions()}
        {!!message && !showMenu ? (
          <span
            className={classNames(styles.message, { [styles.error]: error })}
            messageRef={messageRef}
            tabIndex={-1}
          >
            {message}
          </span>
        ) : null}
      </div>
    )
  },
)

Dropdown.defaultProps = {
  options: [],
  defaultValues: [],
  displayValue: 'value',
  keyValue: 'id',
  multiple: false,
  isSearchable: true,
  disabled: false,
  isSelectedShownInHeader: false,
  onMenuClose: () => {},
  onMenuOpen: () => {},
  onChange: () => {},
  onExceedMaxSelected: () => {},
  canBeEmpty: false,
  maxMenuHeight: 240,
  inPortal: false,
  inPortalMenuSize: 'medium',
  selfControlled: true,
  menuItemHeight: 56,
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
  /** Set max menu height. Default is 240. */
  maxMenuHeight: propTypes.number,
  /** Set height of menu to auto. */
  autoHeight: propTypes.bool,
  /** Set max number of items to choose, if used, set multiple to true. */
  maxSelected: propTypes.number,
  /** Called when max selected options is exceeded. */
  onExceedMaxSelected: propTypes.func,
  /** Called when selected value has changed. */
  onChange: propTypes.func,
  /** Called when input value has changed. */
  onSearch: propTypes.func,
  /** Whether to show multiple selected options in header. */
  isSelectedShownInHeader: propTypes.bool,
  /** Whether to enable search functionality. */
  isSearchable: propTypes.bool,
  /** For css customization. */
  className: propTypes.string,
  /** For css customization. */
  menuClassName: propTypes.string,
  /** For css customization. */
  bulkSelectionClassName: propTypes.string,
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
  /** Custom option renderer function. Function returns render selection checkbox as well. */
  optionRender: propTypes.func,
  /** Text / component to display when there are no options. */
  noOptionsMessage: propTypes.oneOfType([propTypes.string, propTypes.func]),
  /** Helper test to describe error or some information. */
  message: propTypes.string,
  /** Message ref to allow the message to be focused with error. */
  messageRef: propTypes.shape({ current: propTypes.instanceOf(Element) }),
  /** Indicate error mode change border color and message to error color if true. */
  error: propTypes.bool,
  /** If true, will be view mode. <br/>
   *  <i style="background-color:#ffc40026;">NOTE: Also from \<FormProvider> by context. </i>
   */
  view: propTypes.bool,
  /** Render the MenuSelect as the dropdown, the only options are -> multiple select and basic select */
  inPortal: propTypes.bool,
  /** The size of the inPortal Menu, one of - 'small', 'medium', 'large'.*/
  inPortalMenuSize: propTypes.string,
  /** Check whether to update options, in case the options are changeable in their content (without list length change).
   *  Can be removed when Dropdown will be controlled from outside as well.
   */
  isUpdateOptionsOnOptionsContentChange: propTypes.bool,
  /** If true, search is controlled by the dropdown component. Default is true.*/
  selfControlled: propTypes.bool,
  /** If true, select all/none button will be added to the top of the dropdown options menu. Relevant only to multiple selection dropdown.*/
  addBulkSelectionButton: propTypes.bool,
  /** Height of a dropdown menu item. */
  menuItemHeight: propTypes.number,
}

export default memo(Dropdown)
