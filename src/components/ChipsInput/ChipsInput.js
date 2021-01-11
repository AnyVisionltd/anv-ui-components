import React, {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useMemo,
  useCallback,
} from 'react'
import classNames from 'classnames'
import propTypes from 'prop-types'
import { useCombinedRefs } from '../../hooks/UseCombinedRefs'
import { usePrevious } from '../../hooks/UsePrevious'
import { InputBase, Chip, Menu } from '../../index'
import keymap from '../../utils/enums/keymap'
import styles from './ChipsInput.module.scss'
import IconButton from '../IconButton/IconButton'
import { ReactComponent as CancelFilledIcon } from '../../assets/svg/CancelFilled.svg'

const ChipsInput = forwardRef(
  (
    {
      chips: controlledChips,
      defaultChipValues,
      defaultInputValue,
      inputValue: controlledInputValue,
      className,
      onChange,
      onInputChange,
      onFocusChange,
      placeholder,
      renderChipIcon,
      disabled,
      onSubmit,
      validation,
      helperText,
      error,
      autocomplete,
      leadingIcon,
      ...otherProps
    },
    forwardRef,
  ) => {
    const [chipValues, setChipValues] = useState(defaultChipValues)
    const [inputValue, setInputValue] = useState(defaultInputValue)
    const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false)
    const [focusedChipIndex, setFocusedChipIndex] = useState()
    const previousFocusedChipIndex = usePrevious(focusedChipIndex)
    const innerRef = useRef(null)
    const inputBaseRef = useCombinedRefs(forwardRef, innerRef)

    useEffect(() => {
      onChange(chipValues)
    }, [chipValues, onChange])

    useEffect(() => {
      controlledChips && setChipValues(controlledChips)
    }, [controlledChips])

    useEffect(() => {
      onInputChange(inputValue)
    }, [inputValue, onInputChange])

    useEffect(() => {
      if (
        (previousFocusedChipIndex === null || focusedChipIndex === null) &&
        previousFocusedChipIndex !== focusedChipIndex
      ) {
        onFocusChange(focusedChipIndex === null)
      }
    }, [focusedChipIndex, onFocusChange, previousFocusedChipIndex])

    const isChipEditable = () => {
      const inputElement = inputBaseRef.current
      const cursorPosition = inputElement.selectionStart
      const chipsLength = chipValues.length
      return !cursorPosition && chipsLength
    }

    const moveCursorLeft = event => {
      const chipsLength = chipValues.length
      if (!isChipEditable()) return
      if (focusedChipIndex === null) {
        setIsAutocompleteOpen(false)
        setFocusedChipIndex(chipsLength - 1)
        event.preventDefault()
      } else if (focusedChipIndex > 0) {
        setFocusedChipIndex(focusedChipIndex - 1)
        event.preventDefault()
      }
    }

    const moveCursorRight = event => {
      const chipsLength = chipValues.length
      if (!isChipEditable() || focusedChipIndex === null) return
      if (focusedChipIndex >= chipsLength - 1) {
        setFocusedChipIndex(null)
        inputBaseRef.current.focus()
      } else {
        setFocusedChipIndex(focusedChipIndex + 1)
      }
      event.preventDefault()
    }

    const clearChipFocus = () => {
      if (focusedChipIndex !== null) {
        setFocusedChipIndex(null)
        inputBaseRef.current.focus()
      }
    }

    const removeFocusedChip = event => {
      const chipsLength = chipValues.length
      if (!isChipEditable()) return
      removeChip(
        focusedChipIndex === null ? chipsLength - 1 : focusedChipIndex,
        event,
      )
    }

    const removeChipAfterFocusedChip = event => {
      const chipsLength = chipValues.length
      if (
        !isChipEditable() ||
        focusedChipIndex === chipsLength - 1 ||
        focusedChipIndex === null
      )
        return
      event.preventDefault()
      removeChip(focusedChipIndex, event)
    }

    const createChip = chip => {
      if (!chip && !inputValue.length) {
        return
      }
      let newChip
      if (chip) {
        newChip = chip
      } else if (autocomplete) {
        const autocompleteIndex = autocomplete.findIndex(
          ({ label }) => label === inputValue,
        )
        newChip =
          autocompleteIndex >= 0
            ? autocomplete[autocompleteIndex]
            : { label: inputValue, value: inputValue }
      } else {
        newChip = { label: inputValue, value: inputValue }
      }
      if (renderChipIcon) {
        newChip.icon = renderChipIcon(newChip)
      }
      setInputValue('')
      inputBaseRef.current.focus()
      setChipValues(chipValues => {
        const newChips = [...chipValues, newChip]
        onSubmit(newChips)
        return newChips
      })
    }

    const updateChipFocus = useCallback(
      (index, event) => {
        const lastIndex = chipValues.length - 1
        const isRemovedByBackspace = event.keyCode === keymap.BACKSPACE
        const isRemovedLastWithInputFocus =
          index === lastIndex && focusedChipIndex === null
        const isRemovedLastByDelete =
          index === lastIndex && event.keyCode === keymap.DELETE
        const isRemovedFirstByBackspace = index === 0 && isRemovedByBackspace
        if (
          isRemovedFirstByBackspace ||
          isRemovedLastByDelete ||
          isRemovedLastWithInputFocus
        ) {
          inputBaseRef.current.focus()
          setFocusedChipIndex(null)
        } else if (isRemovedByBackspace) {
          setFocusedChipIndex(
            focusedChipIndex === null ? lastIndex - 1 : focusedChipIndex - 1,
          )
        }
      },
      [chipValues, focusedChipIndex, inputBaseRef],
    )

    const removeChip = useCallback(
      (chipIndex, event) => {
        if (disabled) return
        const chips = chipValues.filter((chip, index) => chipIndex !== index)
        updateChipFocus(chipIndex, event)
        onSubmit(chips)
        setChipValues(chips)
      },
      [onSubmit, chipValues, disabled, updateChipFocus],
    )

    const keyFunctionMapping = Object.freeze({
      [keymap.ENTER]: () => createChip(),
      [keymap.ARROW_LEFT]: moveCursorLeft,
      [keymap.ARROW_RIGHT]: moveCursorRight,
      [keymap.ESCAPE]: clearChipFocus,
      [keymap.BACKSPACE]: removeFocusedChip,
      [keymap.DELETE]: removeChipAfterFocusedChip,
    })

    const keyPress = event =>
      keyFunctionMapping[event.keyCode] &&
      keyFunctionMapping[event.keyCode](event)

    const handleInputChange = ({ target: { value } }) => {
      setInputValue(value)
    }

    const onInputFocus = () => {
      setIsAutocompleteOpen(true)
      setFocusedChipIndex(null)
    }

    const removeAllChips = useCallback(() => {
      onSubmit([])
      setChipValues([])
    }, [onSubmit])

    const renderChips = useMemo(
      () => (
        <>
          {chipValues.map(({ label, icon }, index) => {
            const isChipValid = validation(label)
            const chipClasses = classNames(
              styles.chipStyle,
              isChipValid ? undefined : styles.chipError,
            )
            return (
              <Chip
                key={index}
                className={chipClasses}
                isFocused={index === focusedChipIndex}
                onClick={() => setFocusedChipIndex(index)}
                label={label}
                leadingIcon={icon}
                onTrailingIconClick={event => removeChip(index, event)}
                disabled={disabled}
                deletable={!disabled}
              />
            )
          })}
        </>
      ),
      [chipValues, focusedChipIndex, disabled, removeChip, validation],
    )

    const renderHelperText = useMemo(() => {
      if (!helperText) return
      const labelClasses = classNames(
        styles.helperText,
        error ? styles.helperError : undefined,
      )
      return <label className={labelClasses}> {helperText} </label>
    }, [error, helperText])

    const renderRemoveAllChipsIcon = useMemo(() => {
      if (!chipValues.length) return
      return (
        <IconButton
          variant='ghost'
          onClick={removeAllChips}
          aria-label='remove all'
          disabled={disabled}
        >
          <CancelFilledIcon className={styles.cancelIcon} />
        </IconButton>
      )
    }, [removeAllChips, chipValues, disabled])

    const classes = classNames(styles.ChipsInput, className)

    const isChipWithError = useMemo(
      () => chipValues.some(({ label }) => !validation(label)),
      [chipValues, validation],
    )

    const containerClasses = classNames(
      styles.container,
      isChipWithError || error ? styles.error : undefined,
      disabled && styles.disabled,
    )

    const renderAutoComplete = () => {
      if (!autocomplete) return
      return (
        <Menu
          isOpen={isAutocompleteOpen && !!autocomplete.length}
          anchorElement={inputBaseRef.current}
          variant={'dense'}
          onClose={() => setIsAutocompleteOpen(false)}
        >
          {autocomplete.map((item, index) => (
            <Menu.Item
              leadingComponent={item.icon}
              key={index}
              onClick={e => {
                e.stopPropagation()
                createChip(item)
              }}
            >
              {item.label}
            </Menu.Item>
          ))}
        </Menu>
      )
    }

    const handleClick = () => {
      inputBaseRef.current.focus()
    }

    return (
      <div className={classes} onClick={handleClick}>
        <div onKeyDown={keyPress} className={containerClasses}>
          {leadingIcon}
          {renderChips}
          {renderAutoComplete()}
          <InputBase
            autoComplete='off'
            value={controlledInputValue || inputValue}
            className={styles.inputBase}
            ref={inputBaseRef}
            onChange={handleInputChange}
            placeholder={chipValues.length ? `+ ${placeholder}` : placeholder}
            onFocus={onInputFocus}
            trailingIcon={renderRemoveAllChipsIcon}
            disabled={disabled}
            {...otherProps}
          />
        </div>
        {renderHelperText}
      </div>
    )
  },
)

ChipsInput.defaultProps = {
  onChange: () => {},
  onInputChange: () => {},
  onFocusChange: () => {},
  onSubmit: () => {},
  validation: () => true,
  placeholder: 'Input text in here',
  defaultChipValues: [],
  defaultInputValue: '',
  error: false,
}

/**
 * Note: controlled mode was not implemented for this component!
 */
ChipsInput.propTypes = {
  /** Chips array for controlled ChipsInput */
  chips: propTypes.func,
  /** Function to render icon for chip */
  renderChipIcon: propTypes.func,
  /** Chips that are going to appear on the ChipInput:<br />
   *  <code>label</code>     - the label / content of the chip<br />
   *  <code>icon</code>      - the chip's leading icon
   **/
  defaultChipValues: propTypes.arrayOf(
    propTypes.shape({
      label: propTypes.string.isRequired,
      icon: propTypes.element,
    }),
  ),
  /** Default input value */
  defaultInputValue: propTypes.string,
  /** Callback when chips values changed. */
  onChange: propTypes.func,
  /** Callback when chip is submitted. */
  onSubmit: propTypes.func,
  /** Callback when input value changed. */
  onInputChange: propTypes.func,
  /** Callback when input focus changed. */
  onFocusChange: propTypes.func,
  /** Default input place holder. */
  placeholder: propTypes.string,
  /** For css customization. */
  className: propTypes.string,
  /** Controlled input value. */
  inputValue: propTypes.string,
  /** Determine if chip is valid. */
  validation: propTypes.func,
  /** Toggles the error state. */
  error: propTypes.bool,
  /** Leading icon. */
  leadingIcon: propTypes.element,
  /** helper text value. */
  helperText: propTypes.string,
  /** Autocomplete items array: <br />
   *  <code>label</code>      - autocomplete item label<br />
   *  <code>value</code>      - autocomplete item value<br/>
   **/
  autocomplete: propTypes.arrayOf(
    propTypes.shape({
      label: propTypes.oneOfType([propTypes.string, propTypes.number])
        .isRequired,
      value: propTypes.oneOfType([propTypes.string, propTypes.number]),
    }),
  ),
}

export default ChipsInput
