import React, { FC, ReactElement, useContext, useEffect, useRef } from 'react'
import { RangeSlider } from '../../../RangeSlider'
import { Tooltip } from '../../../Tooltip'
import DynamicFilterContext from '../../store/DynamicFilterContext'
import {
  DefaultMaxRange,
  DefaultMinRange,
  DefaultStepRange,
  DefaultValueRange,
  THUMBS_MAP,
} from '../../utils'
import DynamicFilterDualInput from './components/DynamicFilterDualInput'
import DynamicFilterSingleInput from './components/DynamicFilterSingleInput'
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
  const minInputRef = useRef<HTMLInputElement>()
  const maxInputRef = useRef<HTMLInputElement>()
  const isDecimal = step < 1

  useEffect(() => {
    actions.updateElementsState({
      [elementKey]: {
        selectedRange: defaultValue,
      },
    })
  }, [actions, elementKey, defaultValue])

  const onChange = (value: any) => {
    actions.updateElementsState({
      [elementKey]: {
        selectedRange: Array.isArray(value)
          ? value
          : Number(value.target.value),
      },
    })
  }

  return (
    <div className={styles.dynamicFilterSliderContainer}>
      <Tooltip overflowOnly placement='right' content={title}>
        <div className={styles.SliderTitle}>{title}</div>
      </Tooltip>
      <div className={styles.dynamicFilterSliderInnerContainer}>
        <div className={styles.silderContainer}>
          <RangeSlider
            min={min}
            max={max}
            step={step}
            onChange={onChange}
            value={componentState?.selectedRange}
            disabled={undefined}
            isToggleTooltip={undefined}
            measureUnitText={undefined}
            containerClassName={styles.title}
            minGap={undefined}
            onReachingMinGap={undefined}
            isDuration={undefined}
            {...otherProps}
          />
        </div>
        <div className={styles.inputsContainer}>
          {componentState &&
            Array.isArray(componentState.selectedRange) &&
            componentState.selectedRange.map((value: number, idx: number) => (
              <DynamicFilterDualInput
                key={idx === 0 ? THUMBS_MAP.min : THUMBS_MAP.max}
                value={value}
                idx={idx}
                minInputRef={minInputRef}
                maxInputRef={maxInputRef}
                updateElementsState={actions.updateElementsState}
                elementKey={elementKey}
                max={max}
                isDecimal={isDecimal}
                selectedRange={componentState.selectedRange}
                min={min}
                step={step}
              />
            ))}
          {componentState && !Array.isArray(componentState.selectedRange) && (
            <DynamicFilterSingleInput
              updateElementsState={actions.updateElementsState}
              elementKey={elementKey}
              max={max}
              isDecimal={isDecimal}
              selectedRange={componentState.selectedRange}
              min={min}
              step={step}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default DynamicFilterSlider
