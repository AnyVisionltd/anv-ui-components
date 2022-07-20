import React, { FC, ReactElement, useRef } from 'react'
import RangeSlider from '../RangeSlider/RangeSlider'
import SliderDualInput from './components/SliderDualInput'
import SliderSingleInput from './components/SliderSingleInput'
import {
  DefaultMaxRange,
  DefaultMinRange,
  DefaultStepRange,
  THUMBS_MAP,
} from './utils'
import styles from './RangeSliderWithInputs.module.scss'

interface RangeSliderWithInputsProps {
  /** The default value for the slider.*/
  sliderValue: number | Array<number>
  /** Callback for changing the state.*/
  onChange: (value: number | Array<number>) => void
  /** The min value of the range. */
  min?: number
  /** The max value of the range. */
  max?: number
  /** The step by which the value is incremented / decremented. */
  step?: number
  /** Props for the RangeSlider element. */
  otherProps?: Record<string, any>
}

const RangeSliderWithInputs: FC<RangeSliderWithInputsProps> = ({
  min = DefaultMinRange,
  max = DefaultMaxRange,
  step = DefaultStepRange,
  sliderValue,
  onChange,
  otherProps = {},
}): ReactElement => {
  const minInputRef = useRef<HTMLInputElement>()
  const maxInputRef = useRef<HTMLInputElement>()
  const isDecimal = step < 1
  const isDual = Array.isArray(sliderValue)

  const onSliderChange = (value: any) => {
    onChange(Array.isArray(value) ? value : Number(value.target.value))
  }

  return (
    <div className={styles.RangeSliderWithInputsContainer}>
      <div className={styles.sliderContainer}>
        <RangeSlider
          min={min}
          max={max}
          step={step}
          onChange={onSliderChange}
          value={sliderValue}
          disabled={undefined}
          isToggleTooltip={undefined}
          measureUnitText={undefined}
          containerClassName={styles.title}
          minGap={undefined}
          onReachingMinGap={undefined}
          isDuration={undefined}
          {...otherProps}
          data-testid={'range-slider-with-inputs'}
        />
      </div>
      <div className={styles.inputsContainer}>
        {isDual &&
          sliderValue.map((value: number, idx: number) => (
            <SliderDualInput
              key={idx === 0 ? THUMBS_MAP.min : THUMBS_MAP.max}
              inputValue={value}
              idx={idx}
              minInputRef={minInputRef}
              maxInputRef={maxInputRef}
              onChange={onChange}
              max={max}
              isDecimal={isDecimal}
              selectedRange={sliderValue}
              min={min}
              step={step}
            />
          ))}
        {!isDual && (
          <SliderSingleInput
            onChange={onChange}
            max={max}
            isDecimal={isDecimal}
            selectedRange={sliderValue}
            min={min}
            step={step}
          />
        )}
      </div>
    </div>
  )
}

export default RangeSliderWithInputs
