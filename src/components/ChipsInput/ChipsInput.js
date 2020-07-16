import React, { useRef, useState, useEffect } from 'react'
import classNames from 'classnames'
import propTypes from 'prop-types'
import InputBase from '../InputBase/InputBase'
import Chip from '../Chip/Chip'
import keymap from '../../utils/enums/keymap'
import styles from './ChipsInput.module.scss'
import IconButton from "../IconButton/IconButton"
import { ReactComponent as CancelFilledIcon } from "../../assets/svg/CancelFilled.svg"

const ChipsInput = ({
  values,
  className,
  onChange,
  placeholder,
  getChipIcon,
  ...otherProps
}) => {
  const [chipValues, setChipValues] = useState(values)
  const [inputValue, setInputValue] = useState('')
  const [focusedChipIndex, setFocusedChipIndex] = useState(null)
  const inputBaseRef = useRef()

  useEffect(() => onChange(chipValues), [chipValues])

  const isChipEditable = () => {
    const inputElement = inputBaseRef.current
    const cursorPosition = inputElement.selectionStart
    const chipsLength = chipValues.length
    return (!cursorPosition && chipsLength)
  }

  const moveCursorLeft = event => {
    const chipsLength = chipValues.length
    if (!isChipEditable()) return
    if (focusedChipIndex === null) {
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
    removeChip(focusedChipIndex === null ? chipsLength - 1 : focusedChipIndex, event)
  }

  const removeChipAfterFocusedChip = event => {
    const chipsLength = chipValues.length
    if (!isChipEditable() || focusedChipIndex === chipsLength - 1) return
    removeChip(focusedChipIndex, event)
  }

  const validateChipDuplicate = ({ label: newLabel }) => {
    const compareChips = ({ label }) => label === newLabel
    const chipsEqualToNewChip = chipValues.filter(compareChips)
    return !chipsEqualToNewChip.length
  }

  const onAddChip = () => {
    const chip = { label: inputValue }
    if (!inputValue.length || !validateChipDuplicate(chip)) return
    chip.icon = getChipIcon(chip)
    setInputValue('')
    setChipValues([...chipValues, chip])
  }

  const updateChipFocus = (index, event) => {
    const lastIndex = chipValues.length - 1
    const isRemovedByBackspace = event && event.keyCode === keymap.BACKSPACE
    const isRemovedFirstByBackspace = index === 0 && isRemovedByBackspace
    const isRemovedLastByDelete = index === lastIndex && event && event.keyCode === keymap.DELETE
    if (isRemovedFirstByBackspace || isRemovedLastByDelete) {
      inputBaseRef.current.focus()
      setFocusedChipIndex(null)
    } else if (isRemovedByBackspace) {
      setFocusedChipIndex(focusedChipIndex === null ? lastIndex - 1 : focusedChipIndex - 1)
    }
  }

  const removeChip = (chipIndex, event) => {
    const chips = chipValues.filter((chip, index) => chipIndex !== index)
    updateChipFocus(chipIndex, event)
    setChipValues(chips)
  }

  const keyFunctionMapping = Object.freeze({
    [keymap.ENTER]: onAddChip,
    [keymap.ARROW_LEFT]: moveCursorLeft,
    [keymap.ARROW_RIGHT]: moveCursorRight,
    [keymap.ESCAPE]: clearChipFocus,
    [keymap.BACKSPACE]: removeFocusedChip,
    [keymap.DELETE]: removeChipAfterFocusedChip,
  })

  const keyPress = event => keyFunctionMapping[event.keyCode] && keyFunctionMapping[event.keyCode](event)

  const onInputChange = ({ target }) => setInputValue(target.value)

  const onInputFocus = () => setFocusedChipIndex(null)

  const removeAllChips = () => setChipValues([])

  const renderChips = (
    <>
      { chipValues.map(({ label, icon }, index) => (
        <Chip
          key={ index }
          className={ styles.chipStyle }
          isFocused={ index === focusedChipIndex }
          label={ label }
          leadingIcon={ icon }
          onTrailingIconClick={ event => removeChip(index, event) }
          deletable
        />
      )) }
    </>
  )

  const renderRemoveAllChipsIcon = chipValues.length
    ? (
      <IconButton
        variant="ghost"
        onClick={ removeAllChips }
        aria-label="remove all"
      >
        <CancelFilledIcon className={ styles.cancelIcon } />
      </IconButton>
    )
    : null

  const classes = classNames(
    styles.ChipsInput,
    className,
  )

  return (
    <div className={ classes }>
      <div className={ styles.elevationOverlay }/>
      <div  onKeyDown={ keyPress } className={ styles.container }>
        { renderChips }
        <InputBase
          autoComplete="off"
          value={ inputValue }
          className={ styles.inputBase }
          ref={ inputBaseRef }
          onChange={ onInputChange }
          placeholder={ chipValues.length ? `+ ${placeholder}` : placeholder }
          onFocus={ onInputFocus }
          trailingComponent={ renderRemoveAllChipsIcon }
          { ...otherProps }
        />
      </div>
    </div>
  )
}

ChipsInput.defaultProps = {
  onChange: () => {},
  getChipIcon: () => {},
  placeholder: 'Input text in here',
  values: []
}

ChipsInput.propTypes = {
  /**
   * Function to provide icon for added chip
   */
  getChipIcon: propTypes.func,
  /** Chips that are going to appear on the ChipInput:<br />
     *  <code>label</code>     - the label / content of the chip<br />
     *  <code>icon</code>      - the chip's leading icon
     **/
  values: propTypes.arrayOf(propTypes.shape({
    label: propTypes.string.isRequired,
    icon: propTypes.element,
  })),
  /** Callback when changed. */
  onChange: propTypes.func,
  /** Default input place holder. */
  placeholder: propTypes.string,
  /** For css customization. */
  className: propTypes.string,
}

export default ChipsInput
