import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react'
import classNames from 'classnames'
import propTypes from 'prop-types'
import { types } from '../../utils/enums'
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
  const [chips, setChips] = useState()
  const inputBaseRef = useRef()

  const handleMenuOpen = useCallback(
    () => setMenuAnchor(inputBaseRef.current),
    [inputBaseRef],
  )
  const handleMenuClose = useCallback(() => setMenuAnchor(null), [])

  const getLabelTextForInput = useCallback(label => `${label}: `, [])

  const getChipField = useCallback(
    chipLabel => {
      return fields.find(
        ({ label }) => chipLabel.indexOf(getLabelTextForInput(label)) === 0,
      )
    },
    [fields, getLabelTextForInput],
  )

  const isValueContainedInField = useCallback(
    value => {
      return fields.find(
        ({ label }) => label.toLowerCase().indexOf(value.toLowerCase()) === 0,
      )
    },
    [fields],
  )

  useEffect(() => {
    if (inputValue && !isValueContainedInField(inputValue)) {
      handleMenuClose()
    }
  }, [inputValue, isValueContainedInField, handleMenuClose, inputBaseRef])

  const handleChipChange = useCallback(
    chips => {
      const searchQuery = chips.map(chipLabel => {
        const chipField = getChipField(chipLabel)
        return chipField
          ? {
              field: chipField.field,
              value: chipLabel.substr(chipLabel.indexOf(':') + 2),
              ...chipField,
            }
          : { value: chipLabel }
      })
      setMenuAnchor(null)
      setChips(chips)
      onChange(searchQuery)
    },
    [onChange, getChipField],
  )

  const renderChipIcon = ({ label }) => {
    const menuItem = getChipField(label)
    return menuItem && menuItem.icon
  }

  const getInputType = useCallback(
    value => {
      const menuItem = getChipField(value)
      return menuItem ? menuItem.type : types.STRING
    },
    [getChipField],
  )

  const onInputChange = useCallback(
    value => {
      if (getInputType(value) === types.NUMBER) {
        const inputValueOnly = value.slice(value.indexOf(':') + 2)
        if (!Number.isNaN(Number(inputValueOnly))) {
          setInputValue(value)
        }
      } else {
        setInputValue(value)
      }
    },
    [setInputValue, getInputType],
  )

  const menuItems = useMemo(() => {
    const menuItems = fields.filter(
      ({ label }) =>
        label.toLowerCase().indexOf(inputValue.toLowerCase()) === 0,
    )
    if (menuItems.length && document.activeElement === inputBaseRef.current) {
      handleMenuOpen()
    } else {
      handleMenuClose()
    }
    return menuItems
  }, [inputValue, fields, handleMenuClose, handleMenuOpen, inputBaseRef])

  const handleButtonClick = useCallback(
    () =>
      menuAnchor || menuItems.length === 0
        ? handleMenuClose()
        : handleMenuOpen(),
    [menuAnchor, menuItems.length, handleMenuOpen, handleMenuClose],
  )

  const renderAutoComplete = useMemo(() => {
    const onItemClick = label => {
      setInputValue(getLabelTextForInput(label))
      handleMenuClose()
      inputBaseRef.current.focus()
    }

    return (
      <Menu
        variant={'dense'}
        aria-labelledby='menu-element'
        anchorElement={menuAnchor}
        isOpen={!!menuAnchor}
        onClose={handleMenuClose}
      >
        {menuItems.map(({ label }) => (
          <Menu.Item key={label} onClick={() => onItemClick(label)}>
            {label}
          </Menu.Item>
        ))}
      </Menu>
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    handleMenuClose,
    menuAnchor,
    menuItems,
    inputBaseRef,
    getLabelTextForInput,
    chips,
  ])

  const onInputFocus = useCallback(
    isFocused =>
      isFocused && menuItems.length ? handleMenuOpen() : handleMenuClose(),
    [menuItems, handleMenuClose, handleMenuOpen],
  )

  const classes = classNames(styles.SmartFilter, className)

  return (
    <div className={classes}>
      <div className={styles.elevationOverlay} />
      <Button
        className={classNames(
          styles.searchFilter,
          menuAnchor && styles.openedMenu,
        )}
        onClick={handleButtonClick}
      >
        <FilterIcon />
      </Button>
      {renderAutoComplete}
      <ChipsInput
        className={styles.chipInput}
        renderChipIcon={renderChipIcon}
        placeholder={placeholder}
        onFocusChange={onInputFocus}
        onInputChange={onInputChange}
        inputValue={inputValue}
        onChange={handleChipChange}
        onSubmit={handleMenuOpen}
        ref={inputBaseRef}
        {...otherProps}
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
   *  <code>type</code>      - number or string as the possible input types.<br />
   *  <code>icon</code>      - the icon on the chip that will appear
   *                           if the user choose this line in the menu.
   **/
  fields: propTypes.arrayOf(
    propTypes.shape({
      field: propTypes.string.isRequired,
      label: propTypes.string.isRequired,
      type: propTypes.oneOf(['string', 'number', 'date', 'bool']),
      icon: propTypes.element,
    }),
  ),
  /** Callback when changed. */
  onChange: propTypes.func,
  /** Default input place holder. */
  placeholder: propTypes.string,
  /** For css customization. */
  className: propTypes.string,
}

export default SmartFilter
