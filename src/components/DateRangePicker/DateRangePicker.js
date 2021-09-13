import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import DatePicker from '../DatePicker'
import styles from './DateRangePicker.module.scss'
import moment from 'moment'

const DateRangePicker = ({
  className,
  onChange,
  start,
  end,
  disabled,
  format,
}) => {
  const [startDate, setStartDate] = useState(start || moment())
  const [endDate, setEndDate] = useState(end || moment().add(1, 'days'))

  useEffect(() => {
    onChange({ startDate, endDate })
  }, [startDate, endDate])

  return (
    <div className={classNames(styles.dateRangePicker, className)}>
      <DatePicker
        label='From'
        value={startDate}
        onChange={setStartDate}
        maxDate={endDate || ''}
        disabled={disabled}
        format={format}
      />
      <DatePicker
        label='To'
        value={endDate}
        onChange={setEndDate}
        minDate={startDate || ''}
        disabled={disabled}
        format={format}
      />
    </div>
  )
}

DateRangePicker.propTypes = {
  /** Dates format. */
  format: PropTypes.string,
  /** Start date. */
  start: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  /** End date. */
  end: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  /** For css customization. */
  className: PropTypes.string,
  /** Callback when date range changes. Returned object {startDate,endDate} */
  onChange: PropTypes.func,
  /** If true, the inputs will be disabled. */
  disabled: PropTypes.bool,
}

DateRangePicker.defaultProps = {
  onChange: () => {},
  className: '',
  disabled: false,
  format: 'DD/MM/yyyy',
}

export default DateRangePicker
