import React, { useState, useEffect, useRef, memo, useCallback } from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import { useFormProvider } from '../../index'
import { ReactComponent as ArrowSolidDown } from '../../assets/svg/ArrowSolidDown.svg'
import { ReactComponent as ErrorCircleIcon } from '../../assets/svg/ErrorCircleOutlined.svg'
import { useClickOutsideListener } from '../../hooks'
import { InputBase, Menu } from '../../index'
import { useCombinedRefs } from '../../hooks/UseCombinedRefs'
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
    view,
    className,
    message,
    error,
    variant,
    defaultValue,
    onClick,
    items,
    renderItem,
    size,
    menuClassName,
    leadingIcon,
    onChange,
    readOnly,
    multiline,
    autoFocus,
    leadingIconClassName,
    trailingIconClassName,
    label,
    style,
    menuProps,
    ...otherProps
  } = props

  const { isView } = useFormProvider({ view })

  const [isEmpty, setEmpty] = useState(!defaultValue)
  const [value, setValue] = useState(otherProps.value)
  const [active, setActive] = useState(false)
  const [anchorElement, setAnchorElement] = useState(null)
  const textFieldRef = useRef({})
  const cursorRef = useRef({})
  const inputRef = useCombinedRefs(useRef({}), ref)

  useClickOutsideListener(() => {
    setActive(false)
  }, textFieldRef)

  const setActiveFocus = useCallback(
    e => {
      if (!disabled && !readOnly) {
        setActive(textFieldRef.current.contains(e.target))
      }
    },
    [disabled, readOnly],
  )

  useEffect(() => {
    window.addEventListener('focusin', setActiveFocus)
    window.addEventListener('click', setActiveFocus)
    return () => {
      window.removeEventListener('focusin', setActiveFocus)
      window.removeEventListener('click', setActiveFocus)
    }
  }, [setActiveFocus])

  useEffect(() => {
    setEmpty(!defaultValue)
  }, [defaultValue])

  useEffect(() => {
    if (autoFocus) {
      inputRef.current.focus()
      setActive(true)
    }
  }, [autoFocus, inputRef])

  useEffect(() => {
    if (otherProps.value !== undefined) {
      setEmpty(!otherProps.value)
      setValue(otherProps.value)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otherProps.value])

  useEffect(() => {
    const { caretStart, caretEnd } = cursorRef.current
    if (type !== types.options && caretStart && inputRef && inputRef.current) {
      inputRef.current.setSelectionRange(caretStart, caretEnd)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const onInputChange = e => {
    e.persist()
    const {
      target: { value },
    } = e
    setEmpty(!value)
    const caretStart = e.target.selectionStart
    const caretEnd = e.target.selectionEnd
    cursorRef.current = { caretStart, caretEnd }
    onChange(e)
  }

  const renderTrailingIcon = () => {
    if (type === types.options) {
      return <ArrowSolidDown className={styles.optionsIcon} />
    }
    return error && type !== types.password ? (
      <ErrorCircleIcon />
    ) : (
      otherProps.trailingIcon
    )
  }

  const handleMenuClose = () => {
    setAnchorElement(null)
  }

  const handleClick = e => {
    if (!disabled && !readOnly) {
      setActive(true)
      inputRef.current.focus()
    }
    setAnchorElement(anchorElement ? null : textFieldRef.current)
    if (!disabled) {
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
        aria-labelledby={'menu-element'}
        anchorElement={anchorElement}
        isOpen={!!anchorElement}
        onClose={handleMenuClose}
        className={classNames(styles.textFieldMenu, menuClassName)}
        {...menuProps}
      >
        {items.map(item =>
          renderItem ? (
            <div key={item.value} onClick={handleMenuClose}>
              {renderItem(item)}
            </div>
          ) : (
            <Menu.Item key={item.value} onClick={() => onItemClick(item)}>
              {item.label}
            </Menu.Item>
          ),
        )}
      </Menu>
    )
  }

  const classes = classNames(
    styles.textField,
    styles[variant],
    styles[type],
    styles[size],
    {
      [styles.error]: error,
      [styles.disabled]: disabled,
      [styles.active]: active,
      [styles.readOnly]: readOnly,
      [styles.notEmpty]: !isEmpty,
      [styles.multiline]: multiline,
      [styles.withLabel]: !!label,
    },
  )

  const inputValue = type === types.options ? value || defaultValue : value

  const inputDefaultValue = type === types.options ? undefined : defaultValue

  return (
    <div
      className={classNames(styles.container, className, isView && styles.view)}
      style={style}
    >
      <div ref={textFieldRef} onClick={handleClick} className={classes}>
        <label
          className={classNames(styles.label, { [styles.left]: !!leadingIcon })}
        >
          {label}
        </label>
        <InputBase
          {...otherProps}
          disabled={disabled}
          className={classNames(styles.inputBase, { [styles.bottom]: !!label })}
          value={inputValue}
          onChange={onInputChange}
          leadingIconClassName={classNames(
            styles.leadingIcon,
            leadingIconClassName,
          )}
          trailingIconClassName={classNames(
            styles.trailingIcon,
            trailingIconClassName,
          )}
          readOnly={readOnly || type === types.options}
          trailingIcon={renderTrailingIcon()}
          ref={inputRef}
          leadingIcon={leadingIcon}
          multiline={multiline}
          type={type}
          defaultValue={inputDefaultValue}
        />
      </div>
      {type === types.options && renderMenu()}
      {!!message && (
        <span className={classNames(styles.message, { [styles.error]: error })}>
          {message}
        </span>
      )}
    </div>
  )
})

TextField.defaultProps = {
  type: 'text',
  variant: 'outline',
  size: 'medium',
  onClick: () => {},
  onChange: () => {},
  items: [],
  menuProps: {},
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
  /** If true, will be view mode. <br/>
   *  <i style="background-color:#ffc40026;">NOTE: Also from \<FormProvider> by context. </i>
   */
  view: propTypes.bool,
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
  items: propTypes.arrayOf(
    propTypes.shape({
      value: propTypes.oneOfType([propTypes.string, propTypes.number]),
      label: propTypes.oneOfType([propTypes.string, propTypes.number]),
    }),
  ),
  /** Callback to render items of type options */
  renderItem: propTypes.func,
  /** label text to be present in the top of the textField*/
  label: propTypes.string,
  /** @ignore */
  style: propTypes.string,
  /** props to be propagated to menu component*/
  menuProps: propTypes.object,
}

export default memo(TextField)
