import React, { useRef, useState, useEffect, useMemo } from 'react'
import classNames from 'classnames'
import propTypes from 'prop-types'
import Button from '../Button/Button'
import InputBase from '../InputBase/InputBase'
import IconButton from '../IconButton/IconButton'
import Menu from '../Menu/Menu'
import Chip from '../Chip/Chip'
import keymap from '../../utils/enums/keymap'
import { ReactComponent as FilterIcon } from '../../assets/svg/Filter.svg'
import { ReactComponent as CancelFilledIcon } from '../../assets/svg/CancelFilled.svg'
import styles from './SSF.module.scss'

const getChipKey = (name, text) => `${name}${text}`

const SmartFilter = ({
  className,
  fields,
  onChange,
  placeholder,
  ...otherProps
}) => {
  const [menuAnchor, setMenuAnchor] = useState(null)
  const [inputValue, setInputValue] = useState('')
  const [prefixInputValue, setPrefixInputValue] = useState('')
  const [filterChips, setFilterChips] = useState([])
  const [focusedChip, setFocusedChip] = useState(null)
  const inputBaseRef = useRef()

  useEffect(() => {
    const searchQuery = filterChips.map(({ name, text }) => {
      const { field } = fields.find(({ label }) => label === name) || {}
      return { ...field && { field }, value: text }
    })
    onChange(searchQuery)
  }, [filterChips])  // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (prefixInputValue) {
      handleMenuClose()
    }
  }, [prefixInputValue])  // eslint-disable-line react-hooks/exhaustive-deps

  const baseInputLabel = prefixInputValue.slice(0, -2)
  const handleMenuOpen = () => setMenuAnchor(inputBaseRef.current)
  const handleMenuClose = () => setMenuAnchor(null)

  const getChipIcon = name => {
    const [menuItem = {}] = fields.filter(({ label }) => label === name)
    return menuItem.icon
  }

  const getInputType = () => {
    const [menuItem] = fields.filter(({ label }) => label === baseInputLabel)
    return menuItem && menuItem.type ? menuItem.type : 'text'
  }

  const removeChip = (removedKey, event) => {
    const lastIndex = filterChips.length - 1
    const chips = filterChips.filter(({ name, text }, index) => {
      if (removedKey !== getChipKey(name, text)) {
        return true
      }
      const isRemovedByBackspace = event && event.keyCode === keymap.BACKSPACE
      const isRemovedFirstByBackspace = !index && isRemovedByBackspace
      const isRemovedLastByDelete = index === lastIndex && event && event.keyCode === keymap.DELETE
      if (isRemovedFirstByBackspace || isRemovedLastByDelete) {
        inputBaseRef.current.focus()
        setFocusedChip(null)
      } else if (isRemovedByBackspace) {
        setFocusedChip(focusedChip - 1)
      }
      return false
    })
    setFilterChips(chips)
  }

  const removeAllChips = () => setFilterChips([])

  const onItemClick = label => {
    const value = `${label}: `
    setPrefixInputValue(value)
    setInputValue(value)
    handleMenuClose()
    inputBaseRef.current.focus()
  }

  const onInputChange = ({ target }) => {
    const { value } = target
    if (!value.includes(prefixInputValue)) {
      setInputValue('')
      setPrefixInputValue('')
    } else if (getInputType() === 'number') {
      const inputValueOnly = value.slice(prefixInputValue.length)
      if (!Number.isNaN(Number(inputValueOnly))) {
        setInputValue(value)
      }
    } else {
      setInputValue(value)
    }
  }

  const validateChipData = ({ name: newName, text: newText }) => {
    const compareChips = ({ name, text }) => getChipKey(name, text) === getChipKey(newName, newText)
    const chipsEqualToNewChip = filterChips.filter(compareChips)
    return !chipsEqualToNewChip.length
  }

  const onChipSubmit = () => {
    const chip = {}
    if (prefixInputValue) {
      chip.name = baseInputLabel
      chip.text = inputValue.slice(prefixInputValue.length)
      setPrefixInputValue('')
    } else {
      chip.text = inputValue
    }
    chip.icon = getChipIcon(chip.name)
    setInputValue('')
    if (chip.text && validateChipData(chip)) {
      const allChips = [...filterChips, chip]
      setFilterChips(allChips)
    }
    handleMenuOpen()
  }

  const keyPress = event => {
    const inputElement = inputBaseRef.current
    const cursorPosition = inputElement.selectionStart
    const chipsLength = filterChips.length
    switch (event.keyCode) {
    case keymap.ENTER:
      onChipSubmit()
      break
    case keymap.ARROW_LEFT:
      if (!cursorPosition && chipsLength) {
        if (focusedChip === null) {
          setFocusedChip(chipsLength - 1)
        } else if (focusedChip > 0) {
          setFocusedChip(focusedChip - 1)
        }
        handleMenuClose()
      }
      break
    case keymap.ESCAPE:
      if (focusedChip !== null) {
        inputBaseRef.current.focus()
      }
      break
    case keymap.ARROW_RIGHT:
      if (focusedChip !== null && focusedChip < chipsLength - 1) {
        setFocusedChip(focusedChip + 1)
        event.preventDefault()
      } else if (focusedChip >= chipsLength - 1) {
        setFocusedChip(null)
        inputBaseRef.current.focus()
        event.preventDefault()
      }
      break
    case keymap.BACKSPACE:
      if (!cursorPosition && chipsLength && focusedChip === null) {
        const { name, text } = filterChips[chipsLength - 1]
        removeChip(getChipKey(name, text))
      }
      break
    case keymap.DELETE:
      break
    default:
      break
    }
  }

  const renderChips = (
    <>
      { filterChips.map(({ name, text, icon }, index) => (
        <Chip
          key={ getChipKey(name, text) }
          className={ styles.chipStyle }
          isFocused={ index === focusedChip }
          label={ name ? `${name}: ${text}` : text }
          leadingIcon={ icon }
          onTrailingIconClick={ event => removeChip(getChipKey(name, text), event) }
          deletable
        />
      )) }
    </>
  )

  const renderRemoveAllChipsIcon = filterChips.length
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

  const menuItems = useMemo(() => {
    if(prefixInputValue.length) {
      return []
    }
    const typedText = inputValue.slice(prefixInputValue.length).toLowerCase()
    const menuItems = fields.filter(({ label }) => label.toLowerCase().includes(typedText))
    if(menuItems.length && document.activeElement === inputBaseRef.current) {
      handleMenuOpen()
    } else {
      handleMenuClose()
    }
    return menuItems
  }, [inputValue, prefixInputValue.length, fields])

  const handleButtonClick = () => menuAnchor || menuItems.length === 0
    ? setMenuAnchor(null)
    : setMenuAnchor(inputBaseRef.current)

  const renderAutoComplete = () => {
    return (
      <Menu
        aria-labelledby="menu-element"
        anchorElement={ menuAnchor }
        isOpen={ !!menuAnchor }
        onClose={ handleMenuClose }
      >
        { menuItems.map(({ label }) => (
          <Menu.Item key={ label } onClick={ () => onItemClick(label) }>{ label }</Menu.Item>
        )) }
      </Menu>
    )
  }

  const onInputFocus = () => {
    menuItems.length && handleMenuOpen()
    setFocusedChip(null)
  }

  const classes = classNames(
    styles.SmartFilter,
    className,
  )

  return (
    <div className={ classes }>
      <div className={ styles.elevationOverlay }/>
      <Button className={ classNames(styles.searchFilter, menuAnchor && styles.openedMenu) } onClick={ handleButtonClick }>
        <FilterIcon />
      </Button>
      { renderAutoComplete() }
      <div className={ styles.searchInput }>
        <div  onKeyDown={ keyPress } className={ styles.chipsAndInput }>
          { renderChips }
          <InputBase
            autoComplete="off"
            value={ inputValue }
            className={ styles.inputBase }
            ref={ inputBaseRef }
            onChange={ onInputChange }
            placeholder={ filterChips.length ? `+ ${placeholder}` : placeholder }
            onFocus={ onInputFocus }
            trailingComponent={ renderRemoveAllChipsIcon }
            { ...otherProps }
          />
        </div>
      </div>
    </div>
  )
}

SmartFilter.defaultProps = {
  onChange: () => {},
  placeholder: 'Add tag to filter or free type to search',
  fields: [],
}

SmartFilter.propTypes = {
  /** Fields that are going to appear in the search menu:<br />
   *  <code>field</code>     - name of the value of field key that would be returned
   *                           if the user choose this line in the menu.<br />
   *  <code>label</code>     - the name of the menu item that appears.<br />
   *  <code>type</code>      - number or text as the possible input types.<br />
   *  <code>icon</code>      - the icon on the chip that will appear
   *                           if the user choose this line in the menu.
   **/
  fields: propTypes.arrayOf(propTypes.shape({
    field: propTypes.string.isRequired,
    label: propTypes.string.isRequired,
    type: propTypes.oneOf(['text', 'number', 'date']),
    icon: propTypes.element,
  })),
  /** Callback when changed. */
  onChange: propTypes.func,
  /** Default input place holder. */
  placeholder: propTypes.string,
  /** For css customization. */
  className: propTypes.string,
}

export default SmartFilter
