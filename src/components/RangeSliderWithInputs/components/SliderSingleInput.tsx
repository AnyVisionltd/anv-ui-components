import React, { FC, ReactElement } from 'react'
import { TextField } from '../../TextField'
import {
  countDecimals,
  DefaultMaxRange,
  isEmptyString,
  DefaultMinRange,
} from '../utils'

interface SliderSingleInputProps {
  onChange: (value: any) => void
  max: number
  isDecimal: boolean
  min: number
  step: number
  selectedRange: number
}

const SliderSingleInput: FC<SliderSingleInputProps> = ({
  onChange,
  max,
  isDecimal,
  selectedRange,
  min,
  step,
}): ReactElement => {
  const handleInputChange = ({ target: { value } }) => {
    if (
      (!isEmptyString(value) && Number(value) > (max || DefaultMaxRange)) ||
      Number(value) < (min || DefaultMinRange) ||
      countDecimals(value) > (isDecimal ? 2 : 0)
    ) {
      return
    }
    const newValue = isEmptyString(value) ? '' : Number(value)
    onChange(newValue)
  }

  return (
    <TextField
      value={selectedRange}
      onChange={handleInputChange}
      type={'number'}
      min={min}
      max={max}
      step={step}
    />
  )
}

export default SliderSingleInput
