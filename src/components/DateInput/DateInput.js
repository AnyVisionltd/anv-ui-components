import React, { useRef, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import moment from 'moment'
import styles from './DateInput.module.scss'
import 'antd/dist/antd.css'
import { TextField } from '../../'
import { DatePicker } from 'antd'
import { Calendar } from '@anyvision/anv-icons'


const format = ['DD/MM/YYYY']

const DateInput = ({ variant }) => {
  const onChange = (date, dateString) => {
    console.log(date, dateString)
  }

  return (
    <DatePicker
      onChange={onChange}
      format={format}
      inputRender={props => <TextField {...props} label={'Date & Time'}/>}
      bordered={false}
      defaultValue={moment()}
      suffixIcon={<Calendar />}
      className='date-picker'
    />
  )
}

DateInput.propTypes = {
  /** The variant of the textField. */
  variant: PropTypes.oneOf(['fill', 'outline']),
}

DateInput.defualtProps = {
  variant: 'outline',
}

export default DateInput
