import React, { useRef, useState, useEffect } from 'react'
import classNames from 'classnames'
import propTypes from 'prop-types'
import Button from '../Button/Button'
import InputBase from '../InputBase/InputBase'
import IconButton from '../IconButton/IconButton'
import Menu from '../Menu/Menu'
import Chip from '../Chip/Chip'
import keymap from '../../utils/enums/keymap'
import { ReactComponent as FilterIcon } from '../../assets/svg/Filter.svg'
import { ReactComponent as CloseIcon } from '../../assets/svg/Close.svg'
import styles from './SmartFilter.module.scss'

const getChipKey = (name, text) => `${name}${text}`

const SmartFilter = ({
  id,
  className,
  fields,
  onChange,
  placeholder,
  ...otherProps
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [baseInputValue, setBaseInputValue] = useState('')
  const [filterChips, setFilterChips] = useState([])
  const ref = useRef()

  useEffect(() => {
    const searchQuery = filterChips.map(({ name, text }) => {
      const { field } = fields.find(({ label }) => label === name) || {}
      return { ...field && { field }, value: text }
    })
    onChange(searchQuery)
  }, [filterChips]) // eslint-disable-line

  const baseInputLabel = baseInputValue.slice(0, -2)
  const handleMenuClose = () => setIsMenuOpen(false)
  const handleButtonClick = () => setIsMenuOpen(!isMenuOpen)

  const getChipIcon = (name) => {
    const [menuItem = {}] = fields.filter(({ label }) => label === name)
    return menuItem.icon
  }

  const getInputType = () => {
    const [menuItem] = fields.filter(({ label }) => label === baseInputLabel)
    return menuItem && menuItem.type ? menuItem.type : 'text'
  }

  const classes = classNames(
    styles.SmartFilter,
    className,
  )

  const removeChip = (removedKey) => {
    const chips = filterChips.filter(({ name, text }) => removedKey !== getChipKey(name, text))
    setFilterChips(chips)
  }

  const removeAllChips = () => setFilterChips([])

  const onItemClick = (label) => {
    const value = `${label}: `
    setBaseInputValue(value)
    setInputValue(value)
    handleMenuClose()
    document.getElementById(id).focus()
  }

  const onInputChange = ({ target }) => {
    const { value } = target
    if (!value.includes(baseInputValue)) {
      setInputValue('')
      setBaseInputValue('')
    } else if (getInputType() === 'number') {
      const inputValueOnly = value.slice(baseInputValue.length)
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
    if (baseInputValue) {
      chip.name = baseInputLabel
      chip.text = inputValue.slice(baseInputValue.length)
      setBaseInputValue('')
    } else {
      chip.text = inputValue
    }
    chip.icon = getChipIcon(chip.name)
    setInputValue('')
    if (chip.text && validateChipData(chip)) {
      const allChips = [...filterChips, chip]
      setFilterChips(allChips)
    }
  }

  const keyPress = ({ keyCode }) => {
    if (keyCode === keymap.ENTER) {
      onChipSubmit()
    }
  }

  const renderChips = (
    <>
      { filterChips.map(({ name, text, icon }) => (
        <Chip
          key={ getChipKey(name, text) }
          className={ styles.chipStyle }
          label={ name ? `${name}: ${text}` : text }
          leadingIcon={ icon }
          onTrailingIconClick={ () => removeChip(getChipKey(name, text)) }
          deletable
        />
      )) }
    </>
  )

  const renderRemoveAllChipsIcon = filterChips.length
    ? (
      <IconButton className={ styles.closeButton } onClick={ removeAllChips }>
        <CloseIcon className={ styles.closeIcon } />
      </IconButton>
    )
    : null

  const renderMenu = () => {
    if (!fields.length) {
      return null
    }
    return (
      <Menu
        aria-labelledby="menu-story-default"
        anchorElement={ ref.current }
        isOpen={ isMenuOpen }
        onClose={ handleMenuClose }
      >
        { fields.map(({ label }) => (
          <Menu.Item key={ label } onClick={ () => onItemClick(label) }>{ label }</Menu.Item>
        )) }
      </Menu>
    )
  }

  return (
    <div className={ classes }>
      <Button className={ styles.searchFilter } onClick={ handleButtonClick }>
        <FilterIcon />
      </Button>
      { renderMenu() }
      <div className={ styles.searchInput }>
        <div className={ styles.chipsAndInput }>
          { renderChips }
          <InputBase
            id={ id }
            autoComplete="off"
            value={ inputValue }
            className={ styles.inputStyle }
            ref={ ref }
            onChange={ onInputChange }
            placeholder={ filterChips.length ? `+ ${placeholder}` : placeholder }
            onKeyDown={ keyPress }
            onFocus={ handleButtonClick }
            trailingComponent={ renderRemoveAllChipsIcon }
            { ...otherProps }
          />
        </div>
      </div>
    </div>
  )
}

SmartFilter.defaultProps = {
  id: 'input-id',
  onChange: () => {},
  placeholder: 'Add tag to filter or free type to search',
  fields: [],
}

SmartFilter.propTypes = {
  /** @ignore */
  id: propTypes.string,
  /** Fields that are going to appear in the search menu:<br />
   *  <code>field</code>     - name of the value of field key that would be returned
   *                           if the user choose this line in the menu.<br />
   *  <code>label</code>     - the name of the menu item that appears.<br />
   *  <code>type</code>      - number or text as the possible input types.<br />
   *  <code>icon</code>      - the icon on the chip that will appear
   *                           if the user choose this line in the menu. */
  fields: propTypes.arrayOf(propTypes.shape({
    field: propTypes.string.isRequired,
    label: propTypes.string.isRequired,
    type: propTypes.oneOf(['text', 'number']),
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
