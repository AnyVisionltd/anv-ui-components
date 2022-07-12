import React, { FC, ReactElement, useContext, useEffect } from 'react'
import { RangeSliderWithInputs } from '../../../RangeSliderWithInputs'
import { Tooltip } from '../../../Tooltip'
import DynamicFilterContext from '../../store/DynamicFilterContext'
import {
  DefaultMaxRange,
  DefaultMinRange,
  DefaultStepRange,
  DefaultValueRange,
} from '../../utils'
import styles from './DynamicFilterSlider.module.scss'

interface DynamicFilterSliderProps {
  /** The key of the component, On - 'onApply' - the key contains the Resault data.*/
  elementKey: string
  /** The title above the slider.*/
  title: string
  /** The min value of the range. */
  min?: number
  /** The max value of the range. */
  max?: number
  /** The step by which the value is incremented / decremented. */
  step?: number
  /** Props for the RangeSlider element. */
  otherProps?: Record<string, any>
  /** The default value for the slider.*/
  defaultValue?: number | Array<number>
}

const DynamicFilterSlider: FC<DynamicFilterSliderProps> = ({
  min = DefaultMinRange,
  max = DefaultMaxRange,
  step = DefaultStepRange,
  elementKey,
  title,
  defaultValue = DefaultValueRange,
  otherProps = {},
}): ReactElement => {
  const { state, actions } = useContext(DynamicFilterContext)
  const componentState = state.elementsState[elementKey]

  useEffect(() => {
    actions.updateElementsState({
      [elementKey]: {
        selectedRange: defaultValue,
      },
    })
  }, [actions, elementKey, defaultValue])

  const onChange = (value: number | Array<number>) => {
    actions.updateElementsState({
      [elementKey]: {
        selectedRange: value,
      },
    })
  }

  return (
    <div className={styles.dynamicFilterSliderContainer}>
      <Tooltip overflowOnly placement='right' content={title}>
        <div className={styles.SliderTitle}>{title}</div>
      </Tooltip>
      {componentState && (
        <RangeSliderWithInputs
          min={min}
          max={max}
          otherProps={otherProps}
          step={step}
          sliderValue={componentState.selectedRange}
          onChange={onChange}
        />
      )}
    </div>
  )
}

export default DynamicFilterSlider
