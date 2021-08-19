import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import styles from './RangeSlider.module.scss'

const RangeSlider = ({
  min,
  max,
  value,
  onChange,
  step,
  disabled,
  sliderWidth,
  isToggleTooltip,
  ...otherProps
}) => {
  const [showTooltip, setShowTooltip] = useState(false)
  const [hoverValue, setHoverValue] = useState(null)
  const [hoverPos, setHoverPos] = useState(null)
  const sliderRef = useRef(null)
  const tooltipRef = useRef(null)

  const SLIDER_SETTINGS = useMemo(
    () => ({
      fill: styles.fill,
      background: styles.bg,
      thumbSize: 24,
      width: sliderWidth,
      get fixRangeRatio() {
        return (this.thumbSize * 0.5) / this.width
      },
    }),
    [sliderWidth],
  )

  // Get relative position in the slider, between 0 - 1
  const getPositionInSlider = useCallback(
    val => (Number(val) - min) / (max - min),
    [min, max],
  )

  // Get value of slider from the relative position in percentage
  const getValueInSlider = useCallback(
    percentage => (percentage * (max - min)) / 100 + min,
    [min, max],
  )

  // Returns the correct ratio based on the total width times the fixRangeRatio
  const getFixRange = useCallback(
    () => (max - min) * SLIDER_SETTINGS.fixRangeRatio,
    [min, max, SLIDER_SETTINGS.fixRangeRatio],
  )

  // If min value is not divisible by a step bigger than 1, for example min = 3, step = 2
  const fixModuloFromMin = useCallback(() => min % step, [min, step])

  // If step is integer that is not 1. For example, values of step 2 => 0, 2, 4, 6, 8
  const roundValueBasedOnStep = useCallback(
    value => step * Math.round(value / step) + fixModuloFromMin(),
    [step, fixModuloFromMin],
  )

  // Counts number of decimals for float steps like 0.1, 0.01, 1.5
  const countDecimals = useCallback(() => {
    const text = step.toString()
    const index = text.indexOf('.')
    return index === -1 ? 0 : text.length - index - 1
  }, [step])

  useEffect(() => {
    if (!tooltipRef.current) return
    if (isToggleTooltip && !showTooltip) return
    const tooltipPos = hoverPos ?? 100 * getPositionInSlider(value)
    tooltipRef.current.style.left = `${tooltipPos}%`
  }, [showTooltip, hoverPos, isToggleTooltip, value, getPositionInSlider])

  useEffect(() => {
    if (!sliderRef.current) return
    const percentage = 100 * getPositionInSlider(value)
    const bg = `linear-gradient(90deg, ${
      SLIDER_SETTINGS.fill
    } ${percentage}%, ${SLIDER_SETTINGS.background} ${percentage + 0.1}%)`
    sliderRef.current.style.background = bg
  }, [
    value,
    getPositionInSlider,
    SLIDER_SETTINGS.fill,
    SLIDER_SETTINGS.background,
  ])

  /**
   * The problem stems from the fact that the range thumb is 24px size
   * and therefore there is a deviation percentage of thumbSizeRadius / sliderWidth.
   * For example, 24 * 0.5 / 480 = 2.5%. So if pos is in the lower half reduce 0 - 2.5%,
   * and if in the upper half add 0 - 2.5%
   * @function fixThumbRangeDeviation
   * @param {number} hoverVal the almost accurate hover value
   * @returns {number} returns the accurate value
   */
  const fixThumbRangeDeviation = hoverVal => {
    const pos = getPositionInSlider(hoverVal)
    let fixedValue = hoverVal
    const fixRange = getFixRange()

    const posFromCenter = (pos - 0.5) * 2
    const adjustment = posFromCenter * fixRange
    fixedValue += adjustment

    if (step > 1) {
      fixedValue = roundValueBasedOnStep(fixedValue)
    }

    if (fixedValue > max) fixedValue = max
    if (fixedValue < min) fixedValue = min
    return fixedValue
  }

  /**
   * Calculates the middle of the range thumb. If relative position is less than
   * half, it adds 0 - 2.5% to current pos, else - it subtracts 0 - 2.5%. With fixRangeRatio: 0 - 0.025%
   * This function is about position of the thumb, the first function is about hover value.
   * @function posTooltipMiddleThumb
   * @param {number} val the value of the slider
   * @returns {number} the middle position of the range thumb
   */
  const posTooltipMiddleThumb = val => {
    const pos = getPositionInSlider(val)
    let middleValue = Number(val)
    const fixRange = getFixRange()

    const posFromCenter = (pos - 0.5) / 0.5
    const adjustment = posFromCenter * fixRange
    middleValue -= adjustment

    return middleValue
  }

  const calculatePercentage = e => {
    const mouseX = Number(e.nativeEvent.offsetX)
    const curHoverPos = (mouseX / e.target.clientWidth) * 100
    const curHoverVal = getValueInSlider(curHoverPos)
    if (curHoverVal > max || curHoverVal < min) return
    const stepDecimalCount = countDecimals()

    const updatedVal = fixThumbRangeDeviation(curHoverVal)
    setHoverPos(curHoverPos)
    setHoverValue(updatedVal.toFixed(stepDecimalCount))
  }

  const posTooltipToHover = e => {
    if (disabled) return
    calculatePercentage(e)
    isToggleTooltip && setShowTooltip(true)
  }

  const hideTooltip = () => {
    setShowTooltip(false)
  }

  const posTooltipToValue = () => {
    if (disabled) return
    if (isToggleTooltip) return hideTooltip()
    const middleValue = posTooltipMiddleThumb(value)
    setHoverPos(100 * getPositionInSlider(middleValue))
    setHoverValue(value)
  }

  const renderLabels = () => {
    const minLabel = classNames(styles.label, styles.minLabel)
    const maxLabel = classNames(styles.label, styles.maxLabel)

    return (
      <>
        <span className={minLabel}>{min}</span>
        <span className={maxLabel}>{max}</span>
      </>
    )
  }

  const renderTooltip = () => {
    const tooltipEl = (
      <div ref={tooltipRef} className={styles.tooltip}>
        {hoverValue ?? value}
      </div>
    )

    if (isToggleTooltip) return showTooltip && tooltipEl
    return tooltipEl
  }

  return (
    <div className={classNames(styles.container, disabled && styles.disabled)}>
      <div className={styles.rangeContainer}>
        <input
          type='range'
          onMouseMove={posTooltipToHover}
          onMouseOut={posTooltipToValue}
          ref={sliderRef}
          style={{ width: `${SLIDER_SETTINGS.width}px` }}
          min={min}
          max={max}
          value={value}
          onChange={onChange}
          step={step}
          disabled={disabled}
          {...otherProps}
        />
        {renderLabels()}
        {renderTooltip()}
      </div>
    </div>
  )
}

RangeSlider.defaultProps = {
  min: 0,
  max: 100,
  value: 50,
  onChange: () => {},
  step: 1,
  disabled: false,
  sliderWidth: 480,
  isToggleTooltip: false,
}

RangeSlider.propTypes = {
  /** The min value of the range */
  min: propTypes.number,
  /** The max value of the range */
  max: propTypes.number,
  /** Value of the slider */
  value: propTypes.oneOfType([propTypes.string, propTypes.number]),
  /** Callback when the component's state is changed. */
  onChange: propTypes.func,
  /** The step by which the value is incremented / decremented. */
  step: propTypes.number,
  /** Determines the disabled mode of the RangeSlider, if true - disabled. */
  disabled: propTypes.bool,
  /** The width of the range slider. Default is 480 = 480px. */
  sliderWidth: propTypes.number,
  /** Determines if tooltip is toggleable or not, if false - the tooltip is always shown,
   *  else - tooltip is shown only when user hovers over the slider */
  isToggleTooltip: propTypes.bool,
}

export default RangeSlider
