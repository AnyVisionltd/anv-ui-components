import React, { useRef, useEffect, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import MomentUtils from '@date-io/moment'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers'
import { Calendar } from '@anyvision/anv-icons'
import { TextField } from '../TextField'
import { IconButton } from '../IconButton'
import './DatePicker.scss'

const DatePicker = props => {
  const textFieldRef = useRef()
  const [isOpen, setIsOpen] = useState(false)
  const [isFocus, setIsFocus] = useState(false)
  const [date, setDate] = useState(props.defaultValue || new Date())

  useEffect(() => {
    if (isFocus) {
      textFieldRef.current.focus()
      const pos = textFieldRef.current.value
        .split('')
        .findIndex(char => char === '_')
      textFieldRef.current.setSelectionRange(pos, pos)
    }
  }, [textFieldRef, date, isFocus])

  const renderInput = props => (
    <TextField
      trailingIcon={
        <IconButton
          className='abx-datepicker-icon'
          onClick={() =>
            !props.readOnly && !props.disabled && setIsOpen(prev => !prev)
          }
          size='medium'
        >
          <Calendar />
        </IconButton>
      }
      label='Date'
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

  const handleCloseDatePicker = () => {
    setIsOpen(false)
    setIsFocus(false)
  }

  const handleDateChange = useCallback(date => {
    setDate(date)
    props.onDateChange && props.onDateChange(moment(date).format(props.format))
  })

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <div className='abx-date-picker'>
        <KeyboardDatePicker
          autoOk
          format={props.format}
          value={date}
          onChange={handleDateChange}
          TextFieldComponent={renderInput}
          okLabel={null}
          cancelLabel={null}
          variant='inline'
          open={isOpen}
          onClose={handleCloseDatePicker}
          PopoverProps={{
            anchorEl: () => textFieldRef.current,
            anchorOrigin: { horizontal: 138, vertical: 48 },
          }}
          {...props}
        />
      </div>
    </MuiPickersUtilsProvider>
  )
}

DatePicker.propTypes = {
  /** If true, the input will be disabled. */
  disabled: PropTypes.bool,
  /** If true, the you won't be able to chose past dates. */
  disablePast: PropTypes.bool,
  /** If true, the you won't be able to chose future dates. */
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
  onDateChange: PropTypes.func,
}

DatePicker.defaultProps = {
  disabled: false,
  disableFuture: false,
  disablePast: false,
  format: 'DD/MM/yyyy',
  onDateChange: () => {},
}

export default DatePicker
