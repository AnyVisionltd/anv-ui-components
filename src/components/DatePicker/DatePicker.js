import React, { useRef, useEffect, useState, useCallback } from 'react'
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
  defaultValue,
}) => {
  const textFieldRef = useRef()
  const [isOpen, setIsOpen] = useState(false)
  const [isFocus, setIsFocus] = useState(false)
  const [date, setDate] = useState(
    defaultValue ? moment(defaultValue).format(format) : new Date(),
  )

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
      value={props.value}
      onChange={props.onChange}
      ref={textFieldRef}
      onFocus={() => setIsFocus(true)}
      format={props.format}
      {...props}
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
  const handleDateChange = useCallback(date => {
    setDate(date)
    onChange && onChange(moment(date).format(format))
  })

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
          autoOk
          format={'DD/MM/yyyy'}
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
        />
      </ThemeProvider>
    </MuiPickersUtilsProvider>
  )
}

DatePicker.propTypes = {
  /** If true, the input will be disabled. */
  disabled: PropTypes.bool,
  /** If true, you won't be able to choose past dates. */
  disablePast: PropTypes.bool,
  /** If true, you won't be able to choose future dates. */
  disableFuture: PropTypes.bool,
  /** Date format. */
  format: PropTypes.string,
  /**
   * Default date.
   */
  defaultvalue: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  /**
   * Max selectable date.
   */
  maxDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  /**
   * Min selectable date.
   */
  minDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  /**
   * Callback when date change
   */
  onChange: PropTypes.func,
  /**
   * TextField label
   */
  label: PropTypes.string,
}

DatePicker.defaultProps = {
  disabled: false,
  disableFuture: false,
  disablePast: false,
  format: 'DD/MM/yyyy',
  onChange: () => {},
  label: 'Date',
}

export default DatePicker
