import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
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
  startErrorMessage,
  endErrorMessage,
  maxDaysGap,
  startProps,
  endProps,
  ...otherProps
}) => (
  <div className={classNames(styles.dateRangePicker, className)}>
    <DatePicker
      label={startLabel}
      value={start}
      onChange={start => onChange({ start, end })}
      maxDate={end || undefined}
      minDate={
        maxDaysGap && end ? moment(end).subtract(maxDaysGap, 'days') : undefined
      }
      disabled={disabled}
      format={format}
      errorMessage={startErrorMessage}
      {...startProps}
      {...otherProps}
    />
    <DatePicker
      label={endLabel}
      value={end}
      onChange={end => onChange({ start, end })}
      minDate={start || undefined}
      maxDate={
        maxDaysGap && start ? moment(start).add(maxDaysGap, 'days') : undefined
      }
      disabled={disabled}
      format={format}
      errorMessage={endErrorMessage}
      {...endProps}
      {...otherProps}
    />
  </div>
)

DateRangePicker.propTypes = {
  /** Start date. */
  start: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  /** End date. */
  end: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  /** Callback when date range changes. Returned object { start, end } */
  onChange: PropTypes.func.isRequired,
  /** If true, the inputs will be disabled. */
  disabled: PropTypes.bool,
  /** Start date label. */
  startLabel: PropTypes.string,
  /** End date label. */
  endLabel: PropTypes.string,
  /** Custom error message - start date. */
  startErrorMessage: PropTypes.string,
  /** Custom error message - end date. */
  endErrorMessage: PropTypes.string,
  /** Dates format. */
  format: PropTypes.string,
  /** For css customization. */
  className: PropTypes.string,
  /** Maximum days gap before start date and end date. */
  maxDaysGap: PropTypes.number,
  /** Props for the start date picker. */
  startProps: PropTypes.object,
  /** Props for the end date picker. */
  endProps: PropTypes.object,
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
