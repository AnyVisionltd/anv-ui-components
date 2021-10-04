import React, { useRef, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import classNames from 'classnames'
import MomentUtils from '@date-io/moment'
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from '@material-ui/pickers'
import { createTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import { Calendar } from '@anyvision/anv-icons'
import { TextField } from '../TextField'
import { IconButton } from '../IconButton'
import languageService from '../../services/language'
import './DateTimePicker.scss'

const MATERIAL_UI_THEME = {
  typography: {
    fontFamily: ['Poppins'],
    body1: {
      fontSize: '14px',
    },
    body2: {
      fontSize: '14px',
    },
    h3: {
      fontSize: '24px',
    },
    h4: {
      fontSize: '24px',
    },
  },
}

const DateTimePicker = ({
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
          className={classNames('datetimepicker-icon', {
            disabled: props.disabled,
          })}
          onClick={() => !props.disabled && setIsOpen(prev => !prev)}
          size='medium'
        >
          <Calendar />
        </IconButton>
      }
      label={props.label}
      defaultValue={props.value}
      onChange={props.onChange}
      ref={textFieldRef}
      onFocus={() => setIsFocus(true)}
      format={props.format}
      value={props.value}
      disabled={props.disabled}
      error={props.error}
      message={(props.error && errorMessage) || props.helperText}
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
    onChange(date)
  }

  /**
   * Override material ui theme
   */
  const theme = createTheme(MATERIAL_UI_THEME)

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <ThemeProvider theme={theme}>
        <KeyboardDateTimePicker
          autoOk
          ampm={false}
          label={label}
          value={date}
          onChange={handleDateChange}
          TextFieldComponent={renderInput}
          okLabel={null}
          cancelLabel={null}
          variant='inline'
          open={isOpen}
          onClose={handleCloseDatePicker}
          disabled={disabled}
          disablePast={disablePast}
          disableFuture={disableFuture}
          format={format}
          maxDate={maxDate}
          minDate={minDate}
          PopoverProps={{
            anchorEl: () => textFieldRef.current,
            anchorOrigin: { horizontal: 138, vertical: 48 },
          }}
          {...otherProps}
        />
      </ThemeProvider>
    </MuiPickersUtilsProvider>
  )
}

DateTimePicker.propTypes = {
  /** Controlled date&time value. */
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

DateTimePicker.defaultProps = {
  disabled: false,
  disableFuture: false,
  disablePast: false,
  format: 'DD/MM/yyyy HH:mm',
  onChange: () => {},
  label: languageService.getTranslation('dateAndTime'),
  errorMessage: '',
}

export default DateTimePicker
