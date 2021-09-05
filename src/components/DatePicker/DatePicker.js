import React, { useRef, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import MomentUtils from '@date-io/moment'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers'
import { TextField } from '../TextField'
import { Calendar } from '@anyvision/anv-icons'
import './DatePicker.scss'
import { IconButton } from '../IconButton'

const DatePicker = props => {
  const textFieldRef = useRef()
  const [isOpen, setIsOpen] = useState(false)
  const [isFocus, setIsFocus] = useState(false)
  const [selectedDate, handleDateChange] = useState(
    props.defaultValue || new Date(),
  )

  useEffect(() => {
    if (isFocus) {
      textFieldRef.current.focus()
      const pos = textFieldRef.current.value
        .split('')
        .findIndex(char => char === '_')
      textFieldRef.current.setSelectionRange(pos, pos)
    }
  }, [textFieldRef, selectedDate, isFocus])

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

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <div className='abx-date-picker'>
        <KeyboardDatePicker
          autoOk
          format={props.format}
          value={selectedDate}
          onChange={date => handleDateChange(date)}
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
}

DatePicker.defaultProps = {
  disabled: false,
  disableFuture: false,
  disablePast: false,
  format: 'DD/MM/yyyy',
}

export default DatePicker
