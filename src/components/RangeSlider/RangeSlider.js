import React, { useState, useRef, useEffect, useCallback } from 'react'
import styles from './RangeSlider.module.scss'
import propTypes from 'prop-types'
import classNames from 'classnames'

const SLIDER_WIDTHS = {
  sz144: 144,
  sz240: 240,
  sz320: 320,
  sz480: 480,
  sz640: 640,
  sz960: 960,
}

const RangeSlider = ({
  min,
  max,
  value,
  onChange,
  step,
  disabled,
  sliderWidth,
  isDarkTheme,
  isToggleTooltip,
  ...otherProps
}) => {
  const [showTooltip, setShowTooltip] = useState(false)
  const [hoverValue, setHoverValue] = useState(null)
  const [hoverPos, setHoverPos] = useState(null)
  const sliderRef = useRef(null)
  const tooltipRef = useRef(null)

  const SLIDER_SETTINGS = {
    fill: styles.fill,
    background: styles.bg,
    thumbSize: 24,
    width: SLIDER_WIDTHS[sliderWidth] || 480,
    get fixRangeRatio() {
      return (this.thumbSize * 0.5) / this.width
    },
    get fixRangePercentage() {
      return this.fixRangeRatio * 100
    },
  }

  // Get relative position in the slider, between 0 - 1
  const getPositionInSlider = useCallback(
    val => (Number(val) - min) / (max - min),
    [min, max],
  )

  useEffect(() => {
    if (isToggleTooltip && !showTooltip) return
    const tooltipPos = (100 * ((hoverPos || value) - min)) / (max - min)
    tooltipRef.current.style.left = `${tooltipPos}%`
  }, [showTooltip, hoverPos, isToggleTooltip, min, max, value])

  useEffect(() => {
    if (!sliderRef.current) return
    const percentage = 100 * getPositionInSlider(value)
    const bg = `linear-gradient(90deg, ${
      SLIDER_SETTINGS.fill
    } ${percentage}%, ${SLIDER_SETTINGS.background} ${percentage + 0.1}%)`
    sliderRef.current.style.background = bg
  }, [
    value,
    min,
    max,
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
    const pos = getPositionInSlider(hoverValue)
    const { fixRangePercentage } = SLIDER_SETTINGS
    let fixedValue = hoverVal

    if (pos < 0.5) {
      const substraction = (0.5 - pos) / 0.5
      fixedValue -= substraction * fixRangePercentage
    } else {
      const addition = (pos - 0.5) / 0.5
      fixedValue += addition * fixRangePercentage
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
    const { fixRangePercentage, fixRangeRatio } = SLIDER_SETTINGS
    let middleValue = Number(val)

    if (pos < 0.5) {
      const addition = (0.5 - pos) / 0.5
      if (step === 0.1) {
        middleValue += addition * fixRangeRatio
      } else {
        middleValue += addition * fixRangePercentage
      }
    } else {
      const substraction = (pos - 0.5) / 0.5
      if (step === 0.1) {
        middleValue -= substraction * fixRangeRatio
      } else {
        middleValue -= substraction * fixRangePercentage
      }
    }

    return middleValue
  }

  const calculatePercentage = e => {
    const mouseX = Number(e.nativeEvent.offsetX)
    const hoverVal = (mouseX / e.target.clientWidth) * parseInt(max, 10)
    if (hoverVal > max || hoverVal < min) return

    if (step === 0.1) {
      setHoverPos(hoverVal)
      setHoverValue(hoverVal.toFixed(1))
      return
    }

    let updatedVal = fixThumbRangeDeviation(hoverVal)
    setHoverPos(hoverVal)
    setHoverValue(Math.round(updatedVal))
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
    setHoverPos(middleValue)
    setHoverValue(value)
  }

  const renderLabels = () => {
    const minLabel = classNames(
      styles.label,
      styles.minLabel,
      isDarkTheme && styles.dark,
    )
    const maxLabel = classNames(
      styles.label,
      styles.maxLabel,
      isDarkTheme && styles.dark,
    )

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
  sliderWidth: 'sz480',
  isDarkTheme: false,
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
  /** The width of the range slider. Default is 'sz480' = 480px. */
  sliderWidth: propTypes.oneOf([
    'sz144',
    'sz240',
    'sz360',
    'sz480',
    'sz640',
    'sz960',
  ]),
  /** Changes the styles based on background theme, if true - theme is dark. */
  isDarkTheme: propTypes.bool,
  /** Determines if tooltip is toggleable or not, if false - the tooltip is always shown,
   *  else - tooltip is shown only when user hovers over the slider */
  isToggleTooltip: propTypes.bool,
}

export default RangeSlider
