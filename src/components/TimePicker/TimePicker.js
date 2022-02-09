import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import classNames from 'classnames'
import MomentUtils from '@date-io/moment'
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
} from '@material-ui/pickers'
import { createTheme, ThemeProvider } from '@material-ui/core/styles'
import { Calendar } from '@anyvision/anv-icons'
import { TextField } from '../TextField'
import { IconButton } from '../IconButton'
import languageService from '../../services/language'
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

const TimePickerTextField = props => (
  <TextField
    trailingIcon={
      <IconButton
        className={classNames('datepicker-icon', {
          disabled: props.disabled,
        })}
        onClick={() => !props.disabled && props.setIsOpen(prev => !prev)}
        size='medium'
      >
        <Calendar />
      </IconButton>
    }
    label={props.label}
    defaultValue={props.value}
    onChange={props.onChange}
    ref={props.textFieldRef}
    format={props.format}
    value={props.value}
    disabled={props.disabled}
    error={props.error}
    message={(props.error && props.errorMessage) || props.helperText}
  />
)

const TimePicker = ({
  onChange,
  disabled,
  format,
  label,
  value,
  errorMessage,
  ...otherProps
}) => {
  const textFieldRef = useRef()
  const [isOpen, setIsOpen] = useState(false)
  const [date, setDate] = useState(value || moment())

  const handleDateChange = date => {
    setDate(date)
    onChange(date)
  }

  const theme = createTheme(MATERIAL_UI_THEME)

  const additionalProps = { isOpen, setIsOpen, errorMessage, textFieldRef }

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <ThemeProvider theme={theme}>
        <KeyboardTimePicker
          onChange={handleDateChange}
          TextFieldComponent={TimePickerTextField}
          onClose={() => setIsOpen(false)}
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
          {...additionalProps}
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
}

TimePicker.defaultProps = {
  disabled: false,
  format: 'HH:mm',
  onChange: () => {},
  label: languageService.getTranslation('time'),
  errorMessage: '',
}

export default TimePicker
