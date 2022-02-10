import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import classNames from 'classnames'
import MomentUtils from '@date-io/moment'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers'
import { createTheme, ThemeProvider } from '@material-ui/core/styles'
import { Calendar } from '@anyvision/anv-icons'
import { TextField } from '../TextField'
import { IconButton } from '../IconButton'
import languageService from '../../services/language'
import './DatePicker.module.scss'

const DatePickerTextField = props => (
  <TextField
    trailingIcon={
      <IconButton
        className={classNames('datepicker-icon', {
          disabled: props.disabled,
          open: props.isOpen,
        })}
        onClick={() => !props.disabled && props.setIsOpen(prev => !prev)}
        size='medium'
      >
        <Calendar />
      </IconButton>
    }
    type='date-time-picker'
    label={props.label}
    defaultValue={props.value}
    onChange={props.onChange}
    ref={props.textFieldRef}
    format={props.format}
    value={props.value}
    disabled={props.disabled}
    error={props.error}
    message={(props.error && props.errorMessage) || props.helperText}
    onBlur={props.onBlur}
  />
)

const DatePicker = ({
  onChange,
  disabled,
  disablePast,
  disableFuture,
  format,
  maxDate,
  minDate,
  label,
  value,
  errorMessage,
  onClose,
  ...otherProps
}) => {
  const textFieldRef = useRef()
  const [isOpen, setIsOpen] = useState(false)
  const [date, setDate] = useState(value || moment())

  const handleDateChange = date => {
    setDate(date)
    onChange?.(date)
  }

  const handleOnClose = () => {
    setIsOpen(false)
    onClose?.()
  }

  const theme = createTheme({
    typography: {
      fontFamily: ['Poppins'],
    },
  })

  const additionalTextFieldProps = {
    isOpen,
    setIsOpen,
    errorMessage,
    textFieldRef,
  }

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <ThemeProvider theme={theme}>
        <KeyboardDatePicker
          onChange={handleDateChange}
          TextFieldComponent={DatePickerTextField}
          onClose={handleOnClose}
          open={isOpen}
          variant='inline'
          disabled={disabled}
          disablePast={disablePast}
          disableFuture={disableFuture}
          value={date}
          label={label}
          format={format}
          maxDate={maxDate}
          minDate={minDate}
          okLabel={null}
          cancelLabel={null}
          PopoverProps={{
            anchorEl: () => textFieldRef.current,
            anchorOrigin: { horizontal: 138, vertical: 48 },
          }}
          autoOk
          {...otherProps}
          {...additionalTextFieldProps}
        />
      </ThemeProvider>
    </MuiPickersUtilsProvider>
  )
}

DatePicker.propTypes = {
  /** Date value. */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  /** Callback when date change. */
  onChange: PropTypes.func,
  /** TextField label. */
  label: PropTypes.string,
  /** If true, the input will be disabled. */
  disabled: PropTypes.bool,
  /** Custom error message. */
  errorMessage: PropTypes.string,
  /** Date format. */
  format: PropTypes.string,
  /** If true, you won't be able to choose past dates. */
  disablePast: PropTypes.bool,
  /** If true, you won't be able to choose future dates. */
  disableFuture: PropTypes.bool,
  /** Max selectable date. */
  maxDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  /** Min selectable date. */
  minDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
}

DatePicker.defaultProps = {
  disabled: false,
  disableFuture: false,
  disablePast: false,
  format: 'DD/MM/yyyy',
  onChange: () => {},
  label: languageService.getTranslation('date'),
  errorMessage: '',
}

export default DatePicker
