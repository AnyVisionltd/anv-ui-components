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
    type,
    resize,
    trailingIcon,
    disabled,
    className,
    multiline,
    leadingIcon,
    onFocus,
    onTrailingIconClick,
    ...inputProps
  } = props
  const [inputType, setInputType] = useState(type)
  let Input = inputElements.INPUT
  const inputRef = ref || React.createRef()
  const inputClasses = classNames(
    styles.inputBase,
    styles[type],
    resize && styles.resize,
    disabled && styles.disabled,
    className,
  )

  if (multiline) {
    Input = inputElements.TEXTAREA
  }

  const onPasswordIconClick = (e) => {
    setInputType(inputType === inputTypes.PASSWORD ? inputTypes.TEXT : inputTypes.PASSWORD)
    e.stopPropagation()
    onTrailingIconClick()
  }

  const onIconClick = (e) => {
    e.stopPropagation()
    onTrailingIconClick()
  }

  const renderTrailingIcon = () => {
    if (!trailingIcon && type !== inputTypes.PASSWORD) {
      return null
    }
    let icon = trailingIcon
    const shouldRenderPasswordIcon = inputTypes.PASSWORD && !trailingIcon

    if (shouldRenderPasswordIcon) {
      icon = inputType === inputTypes.PASSWORD ? <EyeDisabledIcon /> : <EyeEnabledIcon />
    }

    return (
      <IconButton
        variant="ghost"
        onClick={ shouldRenderPasswordIcon ? onPasswordIconClick : onIconClick }
        disabled={ disabled }
        className={ styles.trailingIcon }
      >
        { icon }
      </IconButton>
    )
  }

  return (
    <div className={ inputClasses }>
      { leadingIcon && <span className={ styles.leadingIcon }>{ leadingIcon }</span> }
      <Input
        ref={ inputRef }
        type={ inputType }
        onFocus={ onFocus }
        disabled={ disabled }
        { ...inputProps }
      />
      { renderTrailingIcon() }
    </div>
  )
})

InputBase.defaultProps = {
  type: 'text',
  // Events
  onFocus: (e) => e,
  onTrailingIconClick: (e) => e,
}

InputBase.propTypes = {
  /** Must be one of the HTML input types. */
  type: propTypes.string,
  /** If true, the text field will be able to resize. */
  resize: propTypes.bool,
  /** If true, the checkbox will be disabled. */
  disabled: propTypes.bool,
  /** Will change thee input to text field */
  multiline: propTypes.bool,
  /** For css customization. */
  className: propTypes.string,
  /** Icon before the children. */
  leadingIcon: propTypes.element,
  /** Icon after the children. */
  trailingIcon: propTypes.element,
  /** Icon after on click. */
  trailingIconClick: propTypes.func,
  /** Event fires when a change appeared in the input element. */
  onChange: propTypes.func,
  /** Event fires when the user click on the last icon */
  onTrailingIconClick: propTypes.func,
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
