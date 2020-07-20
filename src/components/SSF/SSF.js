import React, { useRef, useState, useEffect, useMemo } from 'react'
import classNames from 'classnames'
import propTypes from 'prop-types'
import Button from '../Button/Button'
import ChipsInput from '../ChipsInput/ChipsInput'
import Menu from '../Menu/Menu'
import { ReactComponent as FilterIcon } from '../../assets/svg/Filter.svg'
import styles from './SSF.module.scss'

const SmartFilter = ({
  className,
  fields,
  onChange,
  placeholder,
  ...otherProps
}) => {
  const [menuAnchor, setMenuAnchor] = useState(null)
  const [inputValue, setInputValue] = useState('')
  const inputBaseRef = useRef()

  const getChipField = chipLabel => fields.find(({ label }) => chipLabel.indexOf(label) === 0)

  const handleChipChange = chips => {
    const searchQuery = chips.map(chipLabel => {
      const chipField = getChipField(chipLabel)
      return { ...chipField && { field: chipField.field }, value: chipLabel }
    })
    onChange(searchQuery)
  }

  useEffect(() => {
    if (inputValue) {
      handleMenuClose()
    }
  }, [inputValue])  // eslint-disable-line react-hooks/exhaustive-deps

  const handleMenuOpen = () => setMenuAnchor(inputBaseRef.current)
  const handleMenuClose = () => setMenuAnchor(null)

  const renderChipIcon = ({ label }) => {
    const menuItem = getChipField(label)
    return menuItem && menuItem.icon
  }

  const getInputType = () => {
    const menuItem = getChipField(inputValue)
    return menuItem && menuItem.type ? menuItem.type : 'text'
  }

  const onItemClick = label => {
    setInputValue(`${label}: `)
    handleMenuClose()
    inputBaseRef.current.focus()
  }

  const onInputChange = value => {
    if (!value.includes(inputValue)) {
      setInputValue('')
    } else if (getInputType() === 'number') {
      const inputValueOnly = value.slice(value.indexOf(':') + 2)
      if (!Number.isNaN(Number(inputValueOnly))) {
        setInputValue(value)
      }
    } else {
      setInputValue(value)
    }
  }

  const menuItems = useMemo(() => {
    const menuItems = fields.filter(({ label }) => label.toLowerCase().indexOf(inputValue.toLowerCase()) === 0)
    if(menuItems.length && document.activeElement === inputBaseRef.current) {
      handleMenuOpen()
    } else {
      handleMenuClose()
    }
    return menuItems
  }, [inputValue, fields])

  const handleButtonClick = () => menuAnchor || menuItems.length === 0
    ? setMenuAnchor(null)
    : setMenuAnchor(inputBaseRef.current)

  const renderAutoComplete = () => {
    return (
      <Menu
        variant={ 'dense' }
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

  const onInputFocus = isFocused => isFocused && menuItems.length && handleMenuOpen()

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
      <ChipsInput
        renderChipIcon={ renderChipIcon }
        placeholder={ placeholder }
        onFocusChange={ onInputFocus }
        onInputChange={ onInputChange }
        inputValue={ inputValue }
        onChange={ handleChipChange }
        onSubmit={ handleMenuOpen }
        ref={ inputBaseRef }
        { ...otherProps }
      />
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
