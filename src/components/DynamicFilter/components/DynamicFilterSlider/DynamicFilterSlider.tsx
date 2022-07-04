import React, { FC, ReactElement, useContext, useEffect, useRef } from 'react'
import { RangeSlider } from '../../../RangeSlider'
import { Tooltip } from '../../../Tooltip'
import DynamicFilterContext from '../../store/DynamicFilterContext'
import {
  DefaultMaxRange,
  DefaultMinRange,
  DynamicFilterSliderProps,
  DefaultStepRange,
  DefaultValueRange,
  THUMBS_MAP,
} from '../../utils'
import DynamicFilterDualInput from './components/DynamicFilterDualInput'
import DynamicFilterSingleInput from './components/DynamicFilterSingleInput'
import styles from './DynamicFilterSlider.module.scss'

const DynamicFilterSlider: FC<DynamicFilterSliderProps> = ({
  min,
  max,
  step,
  elementKey,
  title,
  defaultValue,
  otherProps,
}): ReactElement => {
  const { state, actions } = useContext(DynamicFilterContext)
  const componentState = state.elementsState[elementKey]
  const minInputRef = useRef<HTMLInputElement>()
  const maxInputRef = useRef<HTMLInputElement>()
  const isDecimal = (step || DefaultStepRange) < 1

  useEffect(() => {
    actions.updateElementsState({
      [elementKey]: {
        selectedRange: defaultValue || DefaultValueRange,
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
            min={min || DefaultMinRange}
            max={max || DefaultMaxRange}
            step={step || DefaultStepRange}
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
                max={max || DefaultMaxRange}
                isDecimal={isDecimal}
                selectedRange={componentState.selectedRange}
                min={min || DefaultMinRange}
                step={step || DefaultStepRange}
              />
            ))}
          {componentState && !Array.isArray(componentState.selectedRange) && (
            <DynamicFilterSingleInput
              updateElementsState={actions.updateElementsState}
              elementKey={elementKey}
              max={max || DefaultMaxRange}
              isDecimal={isDecimal}
              selectedRange={componentState.selectedRange}
              min={min || DefaultMinRange}
              step={step || DefaultStepRange}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default DynamicFilterSlider
