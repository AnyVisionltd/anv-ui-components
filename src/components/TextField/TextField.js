import React, { useState, useEffect, useRef, memo } from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import { ReactComponent as ArrowSolidDown } from '../../assets/svg/ArrowSolidDown.svg'
import { ReactComponent as ErrorCircleIcon } from '../../assets/svg/ErrorCircleOutlined.svg'
import { useClickOutsideListener } from '../../hooks'
import InputBase from '../InputBase'
import { Menu } from '../Menu/index'
import styles from './TextField.module.scss'

const types = {
  options: 'options',
  text: 'text',
  password: 'password',
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
    size,
    placeholder,
    menuClassName,
    leadingIcon,
    onChange,
    readOnly,
    multiline,
    autoFocus,
    leadingIconClassName,
    trailingIconClassName,
    ...otherProps
  } = props

  const [value, setValue] = useState(defaultValue)
  const [active, setActive] = useState(false)
  const [anchorElement, setAnchorElement] = useState(null)
  const textFieldRef = useRef(ref)
  const inputRef = useRef({})

  useClickOutsideListener(() => {
    setActive(false)
  }, textFieldRef)

  const setActiveFocus = e => {
    setActive(textFieldRef.current.contains(e.target))
  }

  useEffect(() => {
    window.addEventListener('focusin', setActiveFocus)
    window.addEventListener('click', setActiveFocus)
    return () => {
      window.removeEventListener('focusin', setActiveFocus)
      window.removeEventListener('click', setActiveFocus)
    }
  }, [textFieldRef.current])

  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  useEffect(() => {
    if(autoFocus) {
      inputRef.current.focus()
      setActive(true)
    }
  }, [autoFocus])

  useEffect(() => {
    if(otherProps.value !== undefined && otherProps.value !== value) {
      setValue(otherProps.value)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otherProps.value])

  const onInputChange = e => {
    e.persist()
    const { target: { value } } = e
    setValue(value)
    onChange(e)
  }

  const renderTrailingIcon = () => {
    if (type === types.options) {
      return <ArrowSolidDown />
    }
    return error && type !== types.password ? <ErrorCircleIcon /> : otherProps.trailingIcon
  }

  const handleMenuClose = () => {
    setAnchorElement(null)
  }

  const handleClick = e => {
    if (!disabled && !error && !readOnly) {
      setActive(true)
      inputRef.current.focus()
    }
    setAnchorElement(anchorElement ? null : textFieldRef.current)
    if(!disabled) {
      onClick(e)
    }
  }

  const onItemClick = item => {
    setValue(item.label)
    onChange(item)
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
            <div key={ item.value } onClick={ handleMenuClose }>
              { renderItem(item) }
            </div>
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
    <div className={ classNames(styles.container, className) }>
      <div ref={ textFieldRef } onClick={ handleClick } className={ classes }>
        <label className={ classNames(styles.label, { [styles.left]: !!leadingIcon }) }>{ placeholder }</label>
        <InputBase
          { ...otherProps }
          disabled={ disabled }
          className={ classNames(styles.inputBase, { [styles.bottom]: !!placeholder }) }
          value={ value }
          onChange={ onInputChange }
          leadingIconClassName={ classNames(styles.leadingIcon, leadingIconClassName) }
          trailingIconClassName={ classNames(styles.trailingIcon, trailingIconClassName) }
          readOnly={ readOnly || type === types.options }
          trailingIcon={ renderTrailingIcon() }
          ref={ inputRef }
          leadingIcon={ leadingIcon }
          multiline={ multiline }
          type={ type }
        />
      </div>
      { type === types.options && renderMenu() }
      { !!message && <span className={ classNames(styles.message, { [styles.error]: error }) }>{ message }</span> }
    </div>
  )
})

TextField.defaultProps = {
  type: 'text',
  variant: 'outline',
  defaultValue: '',
  size: 'medium',
  onClick: () => { },
  onChange: () => { },
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
  size: propTypes.oneOf(['small', 'medium']),
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
  /** For icon css customization. */
  trailingIconClassName: propTypes.string,
  /** Icon before the children. */
  leadingIcon: propTypes.element,
  /** Icon after the children. */
  trailingIcon: propTypes.element,
  /** Callback when text change. */
  onChange: propTypes.func,
  /** Callback when click. */
  onClick: propTypes.func,
  /** Callback when focus. */
  onFocus: propTypes.func,
  /** autoFocus on input. */
  autoFocus: propTypes.bool,
  /** Array of items if type is options. */
  items: propTypes.arrayOf(propTypes.shape({ value: propTypes.string, label: propTypes.oneOfType([propTypes.string, propTypes.number]) })),
  /** Callback to render items of type options */
  renderItem: propTypes.func,
}

export default memo(TextField)
