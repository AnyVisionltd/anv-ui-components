import React, { useRef, useEffect, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import classNames from 'classnames'
import MomentUtils from '@date-io/moment'
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
} from '@material-ui/pickers'
import { createTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import { Calendar } from '@anyvision/anv-icons'
import { TextField } from '../TextField'
import { IconButton } from '../IconButton'
import './TimePicker.scss'

const TimePicker = ({ onChange, disabled, format, label, value }) => {
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
          className={classNames('bt-timeicker-icon', { disabled })}
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
      {...props}
    />
  )

  /**
   * on close TimePicker dialog - close & remove focus from input
   */
  const handleCloseTimePicker = () => {
    setIsOpen(false)
    setIsFocus(false)
  }

  /**
   * change date & fire onChange event
   */
  const handleDateChange = useCallback(date => {
    setDate(date)
    onChange && onChange(date)
  }, [])

  /**
   * Override material ui theme
   */
  const theme = createTheme({
    typography: {
      fontFamily: ['Poppins'],
      body1: {
        fontSize: '14px',
      },
      body2: {
        fontSize: '12px',
      },
      h2: {
        fontSize: '24px',
      },
    },
  })

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <ThemeProvider theme={theme}>
        <KeyboardTimePicker
          autoOk
          value={date}
          open={isOpen}
          ampm={false}
          label={label}
          variant='inline'
          disabled={disabled}
          format={format}
          PopoverProps={{
            anchorEl: () => textFieldRef.current,
            anchorOrigin: { horizontal: 138, vertical: 48 },
          }}
          onChange={handleDateChange}
          onClose={handleCloseTimePicker}
          TextFieldComponent={renderInput}
        />
      </ThemeProvider>
    </MuiPickersUtilsProvider>
  )
}

TimePicker.propTypes = {
  /** If true, the input will be disabled. */
  disabled: PropTypes.bool,
  /** Date format. */
  format: PropTypes.string,
  /**
   * Controlled time value.
   */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  /**
   * Callback when time change.
   */
  onChange: PropTypes.func,
  /**
   * TextField label.
   */
  label: PropTypes.string,
}

TimePicker.defaultProps = {
  disabled: false,
  format: 'HH:mm',
  onChange: () => {},
  label: 'Time',
}

export default TimePicker
