import React, { useRef, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import classNames from 'classnames'
import MomentUtils from '@date-io/moment'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers'
import { createTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import { Calendar } from '@anyvision/anv-icons'
import { TextField } from '../TextField'
import { IconButton } from '../IconButton'
import './DatePicker.scss'

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
  ...otherProps
}) => {
  const textFieldRef = useRef()
  const [isOpen, setIsOpen] = useState(false)
  const [isFocus, setIsFocus] = useState(false)
  const [date, setDate] = useState(value || moment())

  /**
   * Keeps the input on focus on the first _ char.
   */
  useEffect(() => {
    if (isFocus) {
      textFieldRef.current.focus()
      const pos = textFieldRef.current.value
        .split('')
        .findIndex(char => char === '_')
      textFieldRef.current.setSelectionRange(pos, pos)
    }
  }, [textFieldRef, date, isFocus])

  /**
   * Render custom input - TextField
   */
  const renderInput = props => (
    <TextField
      trailingIcon={
        <IconButton
          className={classNames('bt-datepicker-icon', { disabled })}
          onClick={() => !props.disabled && setIsOpen(prev => !prev)}
          size='medium'
        >
          <Calendar />
        </IconButton>
      }
      label={props.label}
      onClick={props.onClick}
      defaultValue={props.value}
      onChange={props.onChange}
      ref={textFieldRef}
      onFocus={() => setIsFocus(true)}
      format={props.format}
      value={props.value}
      disabled={props.disabled}
      error={props.error}
      message={(props.error && errorMessage) || props.helperText}
      {...props.otherProps}
    />
  )

  /**
   * on close datepicker dialog - close & remove focus from input
   */
  const handleCloseDatePicker = () => {
    setIsOpen(false)
    setIsFocus(false)
  }

  /**
   * change date & fire onChange event
   */
  const handleDateChange = date => {
    setDate(date)
    onChange && onChange(date)
  }

  /**
   * Override material ui theme
   */
  const theme = createTheme({
    typography: {
      fontFamily: ['Poppins'],
    },
  })

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <ThemeProvider theme={theme}>
        <KeyboardDatePicker
          onChange={handleDateChange}
          TextFieldComponent={renderInput}
          onClose={handleCloseDatePicker}
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
  /** Addidional props for DatePicker/TextField component. */
  otherProps: PropTypes.object,
}

DatePicker.defaultProps = {
  disabled: false,
  disableFuture: false,
  disablePast: false,
  format: 'DD/MM/yyyy',
  onChange: () => {},
  label: 'Date',
  errorMessage: '',
  otherProps: {},
}

export default DatePicker
