import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import DatePicker from '../DatePicker/DatePicker'
import styles from './DateRangePicker.module.scss'

const DateRangePicker = ({
  className,
  onChange,
  start,
  end,
  disabled,
  format,
  startLabel,
  endLabel,
  startErrMsg,
  endErrMsg,
  ...otherProps
}) => {
  const handleDateChange = date => {
    onChange(date)
  }

  return (
    <div className={classNames(styles.dateRangePicker, className)}>
      <DatePicker
        label={startLabel}
        value={start}
        onChange={start => handleDateChange({ start, end })}
        maxDate={end || ''}
        disabled={disabled}
        format={format}
        errorMessage={startErrMsg}
        {...otherProps}
      />
      <DatePicker
        label={endLabel}
        value={end}
        onChange={end => handleDateChange({ start, end })}
        minDate={start || ''}
        disabled={disabled}
        format={format}
        errorMessage={endErrMsg}
        {...otherProps}
      />
    </div>
  )
}

DateRangePicker.propTypes = {
  /** Start date. */
  start: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  /** End date. */
  end: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  /** Callback when date range changes. Returned object { start, end } */
  onChange: PropTypes.func,
  /** If true, the inputs will be disabled. */
  disabled: PropTypes.bool,
  /** Start date label. */
  startLabel: PropTypes.string,
  /** End date label. */
  endLabel: PropTypes.string,
  /** Custom error message - start date. */
  startErrMsg: PropTypes.string,
  /** Custom error message - end date. */
  endErrMsg: PropTypes.string,
  /** Dates format. */
  format: PropTypes.string,
  /** For css customization. */
  className: PropTypes.string,
}

DateRangePicker.defaultProps = {
  onChange: () => {},
  className: '',
  disabled: false,
  format: 'DD/MM/yyyy',
  startLabel: 'From',
  endLabel: 'To',
}

export default DateRangePicker
