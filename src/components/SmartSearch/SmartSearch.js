import React, { useRef, useState, useEffect } from 'react'
import classNames from 'classnames'
import propTypes from 'prop-types'
import Button from '../Button/Button'
import InputBase from '../InputBase/InputBase'
import IconButton from '../IconButton/IconButton'
import Menu from '../Menu/Menu'
import Chip from '../Chip/Chip'
import { ReactComponent as FilterIcon } from '../../assets/svg/Filter.svg'
import { ReactComponent as CloseIcon } from '../../assets/svg/Close.svg'
import { ReactComponent as SunIcon } from '../../assets/svg/Sun.svg'
import styles from './SmartSearch.module.scss'

const ENTER_CODE = 13

const getChipKey = (name, text) => `${name}${text}`

const SmartSearch = ({
  className,
  fields,
  onChange,
  defaultIcon,
  defaultMenuItemIcon,
  ...otherProps
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [baseInputValue, setBaseInputValue] = useState('')
  const [chosenChips, setChosenChips] = useState([])
  const ref = useRef()

  const defaultColumns = fields.reduce((acc, { column, isDefault }) => {
    if (isDefault) {
      acc.push(column)
    }
    return acc
  }, [])

  useEffect(() => {
    const searchQuery = chosenChips.map(({ name, text }) => {
      const { column } = fields.find(({ label }) => label === name) || {}
      if (column) {
        return { [column]: text }
      }
      return defaultColumns.reduce((acc, item) => {
        acc[item] = text
        return acc
      }, {})
    })
    onChange(searchQuery)
  }, [chosenChips, defaultColumns, fields, onChange])

  const baseInputLabel = baseInputValue.slice(0, -2)
  const handleMenuClose = () => setIsOpen(false)
  const handleButtonClick = () => setIsOpen(!isOpen)

  const getChipIcon = (name) => {
    const [menuItem] = fields.filter(({ label }) => label === name)
    if (menuItem) {
      return menuItem.icon || defaultMenuItemIcon
    }
    return defaultIcon
  }

  const getInputType = () => {
    const [menuItem] = fields.filter(({ label }) => label === baseInputLabel)
    return menuItem && menuItem.type ? menuItem.type : 'text'
  }

  const classes = classNames(
    styles.smartSearch,
    className,
  )

  const removeChip = (removedKey) => {
    const chips = chosenChips.filter(({ name, text }) => removedKey !== getChipKey(name, text))
    setChosenChips(chips)
  }

  const removeAllChips = () => setChosenChips([])

  const onItemClick = (label) => {
    const value = `${label}: `
    setBaseInputValue(value)
    setInputValue(value)
    handleMenuClose()
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
    const chipsEqualToNewChip = chosenChips.filter(compareChips)
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
      const allChips = [...chosenChips, chip]
      setChosenChips(allChips)
    }
  }

  const keyPress = ({ keyCode }) => {
    if (keyCode === ENTER_CODE) {
      onChipSubmit()
    }
  }

  const renderMenuRow = fields.map(({ label }) => (
    <Menu.Item key={ label } onClick={ () => onItemClick(label) }>{ label }</Menu.Item>
  ))

  const renderChips = (
    <>
      { chosenChips.map(({ name, text, icon }) => (
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

  const renderRemoveAllChipsIcon = chosenChips.length
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
        isOpen={ isOpen }
        onClose={ handleMenuClose }
      >
        { renderMenuRow }
      </Menu>
    )
  }

  return (
    <div className={ classes }>
      <Button className={ styles.searchFilter } onClick={ handleButtonClick } ref={ ref }>
        <FilterIcon className={ styles.filterIcon } />
      </Button>
      { renderMenu() }
      <div className={ styles.searchInput }>
        <div className={ styles.chipsAndInput }>
          { renderChips }
          <InputBase
            autoFocus
            value={ inputValue }
            className={ styles.inputStyle }
            ref={ ref }
            onChange={ onInputChange }
            placeholder="With Icon"
            onKeyDown={ keyPress }
            { ...otherProps }
          />
        </div>
        { renderRemoveAllChipsIcon }
      </div>
    </div>
  )
}

SmartSearch.defaultProps = {
  onChange: () => {},
  placeholder: '+ Add tag to filter or free type to search',
  fields: [],
  defaultIcon: <SunIcon />,
  defaultMenuItemIcon: <SunIcon />,
}

SmartSearch.propTypes = {
  /** For css customization. */
  className: propTypes.string,
  /** Fields that are going to appear in the search menu:
   *  column    - name of the key that would be returned if the user choose this line in the menu.
   *  label     - the name of the menu item that appears.
   *  type      - number or text as the possible input types.
   *  isDefault - if the user does not choose the column, he will receive the chosen input
   *              in all the isDefault=true columns.
   *  icon      - the icon on the chip that will appear if the user choose this line in the menu. */
  fields: propTypes.arrayOf(propTypes.shape({
    column: propTypes.string.isRequired,
    label: propTypes.string.isRequired,
    type: propTypes.oneOf(['text', 'number']),
    isDefault: propTypes.bool,
    icon: propTypes.element,
  })),
  /** Callback when changed. */
  onChange: propTypes.func,
  /** Default input place holder. */
  placeholder: propTypes.string,
  /** The default icon on the chip for free typing. */
  defaultIcon: propTypes.element,
  /** The default icon on the chip for menu items. */
  defaultMenuItemIcon: propTypes.element,
}

export default SmartSearch
