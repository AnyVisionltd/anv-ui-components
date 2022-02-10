import React, { useRef, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import MomentUtils from '@date-io/moment'
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from '@material-ui/pickers'
import { createTheme, ThemeProvider } from '@material-ui/core/styles'
import languageService from '../../services/language'
import { DateTimeTextField } from '../DatePicker'
import { useDebounce } from '../../hooks/UseDebounce'
import './DateTimePicker.module.scss'

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

const theme = createTheme(MATERIAL_UI_THEME)

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
  isNullValue,
  onClose,
  debounceTime,
  ...otherProps
}) => {
  const textFieldRef = useRef()
  const [isOpen, setIsOpen] = useState(false)
  const [date, setDate] = useState(isNullValue ? value : value || moment())
  const { set } = useDebounce(debounceTime)

  useEffect(() => {
    if (value && new Date(value).getTime() !== new Date(date).getTime())
      setDate(value)
  }, [value, date, setDate])

  const handleDateChange = date => {
    setDate(date)

    if (debounceTime) set(() => onChange(date))
    else onChange(date)
  }

  const handleOnClose = () => {
    setIsOpen(false)
    onClose?.()
  }

  const additionalTextFieldProps = {
    isOpen,
    setIsOpen,
    errorMessage,
    textFieldRef,
  }

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <ThemeProvider theme={theme}>
        <KeyboardDateTimePicker
          autoOk
          ampm={false}
          label={label}
          value={date}
          onChange={handleDateChange}
          TextFieldComponent={DateTimeTextField}
          okLabel={null}
          cancelLabel={null}
          variant='inline'
          open={isOpen}
          onClose={handleOnClose}
          disabled={disabled}
          disablePast={disablePast}
          disableFuture={disableFuture}
          format={format}
          maxDate={maxDate}
          minDate={minDate}
          PopoverProps={{
            anchorEl: () => textFieldRef.current,
            anchorOrigin: { horizontal: 143, vertical: 48 },
          }}
          {...otherProps}
          {...additionalTextFieldProps}
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
  /** If true, allow value to be null */
  isNullValue: PropTypes.bool,
  /** Debounce for onChange event. */
  debounceTime: PropTypes.number,
}

DateTimePicker.defaultProps = {
  disabled: false,
  disableFuture: false,
  disablePast: false,
  format: 'DD/MM/yyyy HH:mm',
  onChange: () => {},
  label: languageService.getTranslation('dateAndTime'),
  errorMessage: '',
  isNullValue: false,
}

export default DateTimePicker
