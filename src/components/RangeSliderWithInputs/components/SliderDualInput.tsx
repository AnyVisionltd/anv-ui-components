import React, { FC, ReactElement } from 'react'
import { TextField } from '../../TextField'
import {
  countDecimals,
  DefaultMaxRange,
  isEmptyString,
  THUMBS_MAP,
  DefaultMinRange,
} from '../utils'

interface SliderDualInputProps {
  inputValue: number
  idx: number
  minInputRef: any
  maxInputRef: any
  onChange: (value: any) => void
  max: number
  isDecimal: boolean
  min: number
  step: number
  selectedRange: Array<number>
}

const SliderDualInput: FC<SliderDualInputProps> = ({
  inputValue,
  idx,
  minInputRef,
  maxInputRef,
  onChange,
  max,
  isDecimal,
  selectedRange,
  min,
  step,
}): ReactElement => {
  const handleDualInputChange = ({ target: { name, value } }) => {
    if (
      (!isEmptyString(value) && Number(value) > (max || DefaultMaxRange)) ||
      Number(value) < (min || DefaultMinRange) ||
      countDecimals(value) > (isDecimal ? 2 : 0)
    ) {
      return
    }
    const newValue =
      name === THUMBS_MAP.min
        ? [isEmptyString(value) ? '' : Number(value), selectedRange[1]]
        : [selectedRange[0], isEmptyString(value) ? '' : Number(value)]
    if (name === THUMBS_MAP.min && Number(value) > selectedRange[1]) {
      newValue.reverse()
      maxInputRef?.current?.focus()
    }
    if (
      name === THUMBS_MAP.max &&
      Number(value) > 0 &&
      Number(value) < selectedRange[0]
    ) {
      newValue.reverse()
      minInputRef?.current?.focus()
    }
    onChange(newValue)
  }

  return (
    <TextField
      // @ts-ignore
      value={inputValue}
      ref={idx === 0 ? minInputRef : maxInputRef}
      onChange={handleDualInputChange}
      name={idx === 0 ? THUMBS_MAP.min : THUMBS_MAP.max}
      type={'number'}
      min={min}
      max={max}
      step={step}
      data-testid={'slider-dual-input'}
    />
  )
}

export default SliderDualInput
