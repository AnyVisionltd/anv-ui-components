import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { Calendar } from '@anyvision/anv-icons'
import { ReactComponent as ErrorCircleIcon } from '../../../assets/svg/ErrorCircleOutlined.svg'
import { IconButton, TextField } from '../../../'
import './DateTimeTextField.module.scss'
import { textFieldPropTypes } from '../../TextField/TextField'

const DateTimeTextField = ({
  isOpen,
  setIsOpen,
  label,
  value,
  onChange,
  textFieldRef,
  format,
  disabled,
  error,
  errorMessage,
  helperText,
  ...inputProps
}) => {
  const renderTrailingIcon = ({ isFocused }) => {
    if (error && !isFocused && !isOpen) return <ErrorCircleIcon />

    return (
      <IconButton
        className={classNames('datepicker-icon', {
          disabled: disabled,
          open: isOpen,
        })}
        onClick={() => !disabled && setIsOpen(prev => !prev)}
        size='medium'
      >
        <Calendar />
      </IconButton>
    )
  }

  return (
    <TextField
      trailingIcon={renderTrailingIcon}
      type='date-time-picker'
      label={label}
      defaultValue={value}
      onChange={onChange}
      ref={textFieldRef}
      format={format}
      value={value}
      disabled={disabled}
      error={error}
      message={(error && errorMessage) || helperText}
      {...inputProps}
    />
  )
}

DateTimeTextField.propTypes = {
  ...textFieldPropTypes,
  /** Custom error message. */
  errorMessage: PropTypes.string,
  /** Whether date/time picker menu is opened or not. */
  isOpen: PropTypes.bool.isRequired,
  /** Close/open date/time picker menu. */
  setIsOpen: PropTypes.func.isRequired,
}

export default DateTimeTextField
