import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import MomentUtils from '@date-io/moment'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers'
import { createTheme, ThemeProvider } from '@material-ui/core/styles'
import DateTimeTextField from './DateTimeTextField/DateTimeTextField'
import { useDebounce } from '../../hooks/UseDebounce'
import { useComponentTranslation } from '../../hooks/UseComponentTranslation'
import './DatePicker.module.scss'

const theme = createTheme({
  typography: {
    fontFamily: ['Poppins'],
  },
})

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
  debounceTime,
  ...otherProps
}) => {
  const textFieldRef = useRef()
  const [isOpen, setIsOpen] = useState(false)
  const [date, setDate] = useState(value || moment())
  const { set } = useDebounce(debounceTime)
  const { getComponentTranslation } = useComponentTranslation()
  const DatePickerTranslations = getComponentTranslation('datePicker')

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
    placeholder: format,
  }

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <ThemeProvider theme={theme}>
        <KeyboardDatePicker
          onChange={handleDateChange}
          TextFieldComponent={DateTimeTextField}
          onClose={handleOnClose}
          open={isOpen}
          variant='inline'
          disabled={disabled}
          disablePast={disablePast}
          disableFuture={disableFuture}
          value={date}
          label={label || DatePickerTranslations.date}
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
  /** Debounce for onChange event. */
  debounceTime: PropTypes.number,
}

DatePicker.defaultProps = {
  disabled: false,
  disableFuture: false,
  disablePast: false,
  format: 'DD/MM/yyyy',
  onChange: () => {},
  errorMessage: '',
}

export default DatePicker
