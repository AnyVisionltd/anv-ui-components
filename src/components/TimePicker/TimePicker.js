import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import MomentUtils from '@date-io/moment'
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
} from '@material-ui/pickers'
import { createTheme, ThemeProvider } from '@material-ui/core/styles'
import { DateTimeTextField } from '../DatePicker'
import languageService from '../../services/language'
import { useDebounce } from '../../hooks/UseDebounce'
import './TimePicker.module.scss'

const MATERIAL_UI_THEME = {
  typography: {
    fontFamily: ['Poppins'],
    body1: {
      fontSize: '14px',
    },
    body2: {
      fontSize: '14px',
    },
    h2: {
      fontSize: '24px',
    },
  },
}

const theme = createTheme(MATERIAL_UI_THEME)

const TimePicker = ({
  onChange,
  disabled,
  format,
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
        <KeyboardTimePicker
          onChange={handleDateChange}
          TextFieldComponent={DateTimeTextField}
          onClose={handleOnClose}
          open={isOpen}
          variant='inline'
          disabled={disabled}
          value={date}
          ampm={false}
          label={label}
          format={format}
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

TimePicker.propTypes = {
  /** Controlled time value. */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  /** Callback when time change. */
  onChange: PropTypes.func,
  /** TextField label. */
  label: PropTypes.string,
  /** If true, the input will be disabled. */
  disabled: PropTypes.bool,
  /** Time format. */
  format: PropTypes.string,
  /** Custom error message. */
  errorMessage: PropTypes.string,
  /** Debounce for onChange event. */
  debounceTime: PropTypes.number,
}

TimePicker.defaultProps = {
  disabled: false,
  format: 'HH:mm',
  onChange: () => {},
  label: languageService.getTranslation('time'),
  errorMessage: '',
}

export default TimePicker
