import React, { useRef, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import moment from 'moment'
import styles from './DateRangeInput.module.scss'
import 'antd/dist/antd.css'
import { TextField } from '../../'
import { DatePicker } from 'antd'
import {
  Calendar,
  ArrowRight,
  ArrowLeft,
  ArrowSolidLeft,
  ArrowSolidRight,
} from '@anyvision/anv-icons'

const format = ['DD/MM/YYYY']

const DateRangeInput = ({ variant }) => {
  const onChange = (dates, dateStrings) => {
    if (dates) {
      console.log('From: ', dates[0], ', to: ', dates[1])
      console.log('From: ', dateStrings[0], ', to: ', dateStrings[1])
    } else {
      console.log('Clear')
    }
  }

  const icons = {
    superNextIcon: (
      <div className={styles.arrows}>
        <ArrowRight />
      </div>
    ),
    superPrevIcon: (
      <div className={styles.arrows}>
        <ArrowLeft />
      </div>
    ),
    nextIcon: (
      <div className={styles.arrows}>
        <ArrowRight />
        <ArrowRight />
      </div>
    ),
    prevIcon: (
      <div className={styles.arrows}>
        <ArrowLeft />
        <ArrowLeft />
      </div>
    ),
    suffixIcon: <Calendar />,
  }

  return (
    <DatePicker.RangePicker
      className='date-range-picker'
      onChange={onChange}
      inputRender={props => <TextField {...props} />}
      dropdownClassName='date-range-picker-panel'
      format={'DD/MM/YYYY hh:mm:ss'}
      showTime
      {...icons}
    />
  )
}

DateRangeInput.propTypes = {
  /** The variant of the textField. */
  variant: PropTypes.oneOf(['fill', 'outline']),
}

DateRangeInput.defualtProps = {
  variant: 'outline',
}

export default DateRangeInput
