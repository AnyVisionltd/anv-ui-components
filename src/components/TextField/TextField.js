import React, { memo, useState, useEffect, useRef } from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import uuid from 'uuid'
import { ReactComponent as ArrowSolidDown } from '../../assets/svg/ArrowSolidDown.svg'
import { ReactComponent as ErrorCircleIcon } from '../../assets/svg/ErrorCircleOutlined.svg'
import { useClickOutsideListener } from '../../hooks'
import InputBase from '../InputBase'
import { Menu } from '../Menu/index'
import styles from './TextField.module.scss'

const types = {
  options: 'options',
  text: 'text',
}

const TextField = React.forwardRef((props, ref) => {
  const {
    type,
    disabled,
    className,
    message,
    error,
    variant,
    defaultValue,
    onClick,
    items,
    renderItem,
    onMenuItemClick,
    size,
    placeholder,
    menuClassName,
    id,
    ...inputProps
  } = props

  const [value, setValue] = useState(inputProps.value || defaultValue)
  const [active, setActive] = useState(false)
  const [inputId, setInputId] = useState(id)
  const textFieldRef = useRef(ref)
  const inputRef = useRef({})

  const [anchorElement, setAnchorElement] = useState(null)

  useClickOutsideListener(() => {
    if (type !== types.options) {
      setActive(false)
    }
  }, textFieldRef)

  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  useEffect(() => {
    setInputId(id || uuid())
  }, [id])

  const { leadingIcon, onChange, readOnly, multiline } = inputProps

  const onInputChange = e => {
    const { target: { value } } = e
    setValue(value)
    onChange(e)
  }

  const generateTrailingIcon = () => {
    if (type === types.options) {
      return <ArrowSolidDown />
    }
    return error ? <ErrorCircleIcon /> : inputProps.trailingComponent
  }

  const handleMenuClose = () => {
    setAnchorElement(null)
    setActive(false)
  }

  const handleClick = e => {
    if (!disabled && !error && !readOnly) {
      inputRef.current.focus()
      setActive(true)
    }
    setAnchorElement(anchorElement ? null : textFieldRef.current)
    onClick(e)
  }

  const onItemClick = item => {
    setValue(item.label)
    onMenuItemClick(item)
    handleMenuClose()
  }

  const renderMenu = () => {
    return (
      <Menu
        aria-labelledby={ 'menu-element' }
        anchorElement={ anchorElement }
        isOpen={ !!anchorElement }
        onClose={ handleMenuClose }
        className={ classNames(styles.textFieldMenu, menuClassName) }
      >
        {
          items.map(item => renderItem
            ?
            renderItem(item)
            :
            (<Menu.Item key={ item.value } onClick={ () => onItemClick(item) }>
              { item.label }
            </Menu.Item>)
          )
        }
      </Menu>
    )
  }


  const classes = classNames(
    styles.TextField,
    styles[variant],
    styles[type],
    styles[size],
    className,
    {
      [styles.error]: error,
      [styles.disabled]: disabled,
      [styles.active]: active,
      [styles.readOnly]: readOnly,
      [styles.notEmpty]: !!value,
      [styles.multiline]: multiline,
    }
  )

  return (
    <div className={ styles.container }>
      <div ref={ textFieldRef } onClick={ handleClick } className={ classes }>
        <label htmlFor={ inputId } className={ classNames(styles.label, { [styles.left]: !!leadingIcon }) }>{ placeholder }</label>
        <InputBase
          { ...inputProps }
          disabled={ disabled }
          className={ classNames(styles.inputBase, { [styles.bottom]: !!placeholder }) }
          id={ inputId }
          value={ value }
          onChange={ onInputChange }
          leadingIconClassName={ classNames(styles.leadingIcon) }
          readOnly={ readOnly || type === types.options }
          trailingComponent={ generateTrailingIcon() }
          ref={ inputRef }
        />
      </div>
      { type === types.options && renderMenu() }
      { message && <span className={ classNames(styles.message, { [styles.error]: error }) }>{ message }</span> }
    </div>
  )
})

TextField.defaultProps = {
  type: 'text',
  variant: 'outline',
  defaultValue: '',
  size: 'basic',
  onClick: () => { },
  onChange: () => { },
  onMenuItemClick: () => { },
  items: [],
}

TextField.propTypes = {
  type: propTypes.string,
  /** The variant of the textField. */
  variant: propTypes.oneOf(['fill', 'outline']),
  /** The default input element value. Use when the component is not controlled. */
  defaultValue: propTypes.oneOfType([propTypes.string, propTypes.number]),
  /** Number of rows to display when multiline option is set to true. */
  rows: propTypes.oneOfType([propTypes.string, propTypes.number]),
  /** size (height )of the textField */
  size: propTypes.oneOf(['basic', 'dense']),
  /** If true, the input will be disabled. */
  disabled: propTypes.bool,
  /** Will change the input to text field */
  multiline: propTypes.bool,
  /** Will change the input read-only */
  readOnly: propTypes.bool,
  /** For css customization. */
  className: propTypes.string,
  /** For css customization. */
  menuClassName: propTypes.string,
  /** For icon css customization. */
  leadingIconClassName: propTypes.string,
  /** Icon before the children. */
  leadingIcon: propTypes.element,
  /** Icon after the children. */
  trailingComponent: propTypes.element,
  /** Callback when text change. */
  onChange: propTypes.func,
  /** Callback when click. */
  onClick: propTypes.func,
  /** Callback when focus. */
  onFocus: propTypes.func,
  /** Array of items if type is options. */
  items: propTypes.arrayOf(propTypes.shape({ value: propTypes.string, label: propTypes.oneOfType([propTypes.string, propTypes.number]) })),
  /** Callback to render items of type options */
  renderItem: propTypes.func,
  /** Callback to handle item of type options click  */
  onMenuItemClick: propTypes.func,
}

export default memo(TextField)
