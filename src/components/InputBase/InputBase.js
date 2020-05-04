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
    size,
    type,
    resize,
    lastIcon,
    disabled,
    className,
    multiline,
    leadingIcon,
    onFocus,
    onLastIconClick,
    ...inputProps
  } = props
  const [inputType, setInputType] = useState(type)
  let Input = inputElements.INPUT
  const inputRef = ref || React.createRef()
  const inputClasses = classNames(
    styles.inputBase,
    styles[size],
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
    onLastIconClick()
  }

  const onIconClick = (e) => {
    e.stopPropagation()
    onLastIconClick()
  }

  const renderLastIcon = () => {
    if (!lastIcon && type !== inputTypes.PASSWORD) {
      return null
    }
    let icon = lastIcon
    const shouldRenderPasswordIcon = inputTypes.PASSWORD && !lastIcon

    if (shouldRenderPasswordIcon) {
      icon = inputType === inputTypes.PASSWORD ? <EyeDisabledIcon /> : <EyeEnabledIcon />
    }

    return (
      <IconButton
        variant="ghost"
        onClick={ shouldRenderPasswordIcon ? onPasswordIconClick : onIconClick }
        disabled={ disabled }
        className={ styles.lastIcon }
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
      { renderLastIcon() }
    </div>
  )
})

InputBase.defaultProps = {
  size: 'large',
  type: 'text',
  // Events
  onFocus: (e) => e,
  onLastIconClick: (e) => e,
}

InputBase.propTypes = {
  /** The size of the button. */
  size: propTypes.oneOf(['small', 'large']),
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
  lastIcon: propTypes.element,
  /** Icon after on click. */
  lastIconClick: propTypes.func,
  /** Event fires when a change appeared in the input element. */
  onChange: propTypes.func,
  /** Event fires when the user click on the last icon */
  onLastIconClick: propTypes.func,
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
