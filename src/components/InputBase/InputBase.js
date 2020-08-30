import React, { useState, memo } from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import { IconButton } from '../IconButton'
import { ReactComponent as EyeDisabledIcon } from '../../assets/svg/EyeDisabled.svg'
import { ReactComponent as EyeEnabledIcon } from '../../assets/svg/EyeEnabled.svg'
import styles from './InputBase.module.scss'

const inputElements = Object.freeze({
  INPUT: 'input',
  TEXTAREA: 'textarea',
})

const inputTypes = Object.freeze({
  TEXT: 'text',
  PASSWORD: 'password',
})

const InputBase = React.forwardRef((props, ref) => {
  const {
    rows,
    type,
    disabled,
    className,
    multiline,
    leadingIcon,
    trailingIcon,
    leadingIconClassName,
    trailingIconClassName,
    ...otherProps
  } = props
  const [inputType, setInputType] = useState(type)
  const inputRef = ref || React.createRef()
  const inputClasses = classNames(
    styles.inputBase,
    styles[type],
    disabled && styles.disabled,
    multiline && styles.multiline,
    className,
  )
  let Input = inputElements.INPUT
  let elementProps = otherProps

  if (multiline) {
    Input = inputElements.TEXTAREA
    elementProps = { rows, ...elementProps }
  } else {
    elementProps = { type, ...elementProps }
  }

  const onPasswordIconClick = e => {
    setInputType(inputType === inputTypes.PASSWORD ? inputTypes.TEXT : inputTypes.PASSWORD)
    e.stopPropagation()
  }

  const renderTrailingIcon = () => {
    if (!trailingIcon && type !== inputTypes.PASSWORD) {
      return null
    }
    if (trailingIcon) {
      return <div className={ classNames(styles.trailingIcon, trailingIconClassName) }>
        { trailingIcon }
      </div>
    }
    return (
      <IconButton
        variant="ghost"
        onClick={ onPasswordIconClick }
        disabled={ disabled }
        className={ classNames(styles.trailingIcon, trailingIconClassName) }
      >
        { inputType === inputTypes.PASSWORD ? <EyeDisabledIcon /> : <EyeEnabledIcon /> }
      </IconButton>
    )
  }

  return (
    <div className={ inputClasses }>
      { leadingIcon && <span className={ classNames(styles.leadingIcon, leadingIconClassName) }>{ leadingIcon }</span> }
      <Input
        ref={ inputRef }
        disabled={ disabled }
        { ...elementProps }
        type={ inputType }
      />
      { renderTrailingIcon() }
    </div>
  )
})

InputBase.defaultProps = {
  type: 'text',
}

InputBase.propTypes = {
  /** Must be one of the HTML input types. */
  type: propTypes.string,
  /** The value of the input element, required for a controlled component. */
  value: propTypes.oneOfType([propTypes.string, propTypes.number]),
  /** The default input element value. Use when the component is not controlled. */
  defaultValue: propTypes.oneOfType([propTypes.string, propTypes.number]),
  /** Number of rows to display when multiline option is set to true. */
  rows: propTypes.oneOfType([propTypes.string, propTypes.number]),
  /** If true, the input will be disabled. */
  disabled: propTypes.bool,
  /** Will change the input to text field */
  multiline: propTypes.bool,
  /** Will change the input read-only */
  readOnly: propTypes.bool,
  /** For css customization. */
  className: propTypes.string,
  /** For icon css customization. */
  leadingIconClassName: propTypes.string, 
  /** For icon css customization. */
  trailingIconClassName: propTypes.string,
  /** Icon before the children. */
  leadingIcon: propTypes.element,
  /** Icon after the children. */
  trailingIcon: propTypes.element,
  /** Event fires when a change appeared in the input element. */
  onChange: propTypes.func,
  /** @ignore */
  onClick: propTypes.func,
  /** @ignore */
  onFocus: propTypes.func,
  /** @ignore */
  onKeyUp: propTypes.func,
  /** @ignore */
  onKeyDown: propTypes.func,
}

export default memo(InputBase)
