import React, {
  useState,
  useRef,
  useCallback,
  useMemo,
  useLayoutEffect,
} from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import keymap from '../../utils/enums/keymap'
import { SingleThumb } from './SingleThumb'
import { DualThumb } from './DualThumb'
import styles from './RangeSlider.module.scss'

const keyboardButtons = [
  keymap.ARROW_DOWN,
  keymap.ARROW_UP,
  keymap.ARROW_LEFT,
  keymap.ARROW_RIGHT,
  keymap.PAGE_UP,
  keymap.PAGE_DOWN,
  keymap.END,
  keymap.HOME,
]

const RangeSlider = ({
  min,
  max,
  value,
  onChange,
  step,
  disabled,
  isToggleTooltip,
  measureUnitText,
  containerClassName,
  minGap,
  ...otherProps
}) => {
  const [showTooltip, setShowTooltip] = useState(false)
  const [hoverValue, setHoverValue] = useState(null)
  const [hoverPos, setHoverPos] = useState(null)
  const containerRef = useRef(null)
  const isDualThumb = Array.isArray(value)

  const SLIDER_SETTINGS = useMemo(
    () => ({
      fill: styles.fill,
      background: styles.bg,
      thumbSize: 24,
      width: null,
      get fixRangeRatio() {
        return (this.thumbSize * 0.5) / this.width
      },
    }),
    [],
  )

  useLayoutEffect(() => {
    if (!containerRef.current) return
    if (SLIDER_SETTINGS.width) return
    SLIDER_SETTINGS.width = containerRef.current.offsetWidth
  }, [SLIDER_SETTINGS])

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

  /**
   * Calculates the middle of the range thumb. If relative position is less than
   * half, it adds 0 - 2.5% to current pos, else - it subtracts 0 - 2.5%.
   * This function is about position of the thumb, the first function is about hover value.
   * @function posTooltipMiddleThumb
   * @param {number} val the value of the slider
   * @returns {number} the middle position of the range thumb
   */
  const posTooltipMiddleThumb = useCallback(
    val => {
      const pos = getPositionInSlider(val)
      const posFromCenter = (pos - 0.5) / 0.5
      const adjustment = posFromCenter * getFixRange()
      return Number(val) - adjustment
    },
    [getFixRange, getPositionInSlider],
  )

  // Positions the dual thumb tooltip in the middle of the thumb
  const posDualThumbTooltip = useCallback(
    val => {
      const middleValue = posTooltipMiddleThumb(val)
      return 100 * getPositionInSlider(middleValue)
    },
    [posTooltipMiddleThumb, getPositionInSlider],
  )

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

    const posFromCenter = (pos - 0.5) / 0.5
    const adjustment = posFromCenter * getFixRange()
    fixedValue += adjustment

    if (step > 1) {
      fixedValue = roundValueBasedOnStep(fixedValue)
    }

    if (fixedValue > max) {
      fixedValue = max
    } else if (fixedValue < min) {
      fixedValue = min
    }

    return fixedValue
  }

  const posTooltipToHover = e => {
    const mouseX = Number(e.nativeEvent.offsetX)
    const curHoverPos = (mouseX / e.target.clientWidth) * 100
    const curHoverVal = getValueInSlider(curHoverPos)
    if (curHoverVal > max || curHoverVal < min) return

    setHoverPos(curHoverPos)
    const stepDecimalCount = countDecimals()
    const updatedVal = fixThumbRangeDeviation(curHoverVal)
    setHoverValue(updatedVal.toFixed(stepDecimalCount))
  }

  const hideTooltip = () => showTooltip && setShowTooltip(false)

  const posTooltipToValue = () => {
    if (disabled) return
    const middleValue = posTooltipMiddleThumb(value)
    setHoverPos(100 * getPositionInSlider(middleValue))
    setHoverValue(value)
  }

  const onMouseMove = e => {
    if (disabled) return
    !showTooltip && setShowTooltip(true)
    !isDualThumb && posTooltipToHover(e)
  }

  const onMouseOut = () => {
    if (disabled) return
    if (isToggleTooltip || isDualThumb) return hideTooltip()
    posTooltipToValue()
  }

  // KeyDown is called while user presses the arrows and KeyUp is called when the press
  // is done, so the input value will be updated and won't be one step ahead.
  const handleSingleThumbKeyPress = e => {
    if (keyboardButtons.includes(e.keyCode)) {
      posTooltipToValue()
    }
  }

  const renderLabels = () => {
    const minLabel = classNames(styles.label, styles.minLabel)
    const maxLabel = classNames(styles.label, styles.maxLabel)

    return (
      <>
        <span className={minLabel}>
          {min}
          {measureUnitText}
        </span>
        <span className={maxLabel}>
          {max}
          {measureUnitText}
        </span>
      </>
    )
  }

  const renderSingleThumbTooltip = ref =>
    !isToggleTooltip || showTooltip ? (
      <div ref={ref} className={styles.tooltip}>
        {hoverValue ?? value}
        {measureUnitText}
      </div>
    ) : null

  const renderDualThumbTooltip = (ref, textValue) => (
    <div
      ref={ref}
      className={styles.tooltip}
      style={{ visibility: showTooltip ? 'visible' : 'hidden' }}
    >
      {textValue ?? value}
      {measureUnitText}
    </div>
  )

  const commonProps = {
    SLIDER_SETTINGS,
    getPositionInSlider,
    min,
    max,
    onChange,
    step,
    disabled,
  }

  const renderSingleThumbRange = () => (
    <SingleThumb
      {...commonProps}
      value={value}
      isToggleTooltip={isToggleTooltip}
      hoverPos={hoverPos}
      onKeyUp={handleSingleThumbKeyPress}
      onKeyDown={handleSingleThumbKeyPress}
      renderTooltip={renderSingleThumbTooltip}
      showTooltip={showTooltip}
      {...otherProps}
    />
  )

  const renderDualThumbRange = () => (
    <DualThumb
      {...commonProps}
      values={value}
      getValueInSlider={getValueInSlider}
      posTooltipToValue={posDualThumbTooltip}
      countDecimals={countDecimals}
      renderTooltip={renderDualThumbTooltip}
      minGap={minGap}
      {...otherProps}
    />
  )

  return (
    <div
      className={classNames(
        styles.container,
        disabled && styles.disabled,
        containerClassName,
      )}
    >
      <div
        className={styles.rangeContainer}
        ref={containerRef}
        onMouseMove={onMouseMove}
        onMouseOut={onMouseOut}
      >
        {!isDualThumb ? renderSingleThumbRange() : renderDualThumbRange()}
        {renderLabels()}
      </div>
    </div>
  )
}

RangeSlider.defaultProps = {
  min: 0,
  max: 100,
  onChange: () => {},
  step: 1,
  disabled: false,
  isToggleTooltip: false,
  measureUnitText: '',
}

RangeSlider.propTypes = {
  /** The min value of the range. */
  min: propTypes.number,
  /** The max value of the range. */
  max: propTypes.number,
  /** Value of the slider */
  value: propTypes.oneOfType([
    propTypes.string,
    propTypes.number,
    propTypes.arrayOf(propTypes.number),
  ]),
  /** Callback when the component's state is changed. */
  onChange: propTypes.func,
  /** The step by which the value is incremented / decremented. */
  step: propTypes.number,
  /** Determines the disabled mode of the RangeSlider, if true - disabled. */
  disabled: propTypes.bool,
  /** Determines if tooltip is toggleable or not, if false - the tooltip is always shown,
   *  else - tooltip is shown only when user hovers over the slider. */
  isToggleTooltip: propTypes.bool,
  /** Possibly add units of measurement for labels and hover value, like hours, minutes, meters etc. */
  measureUnitText: propTypes.string,
  /** Determines the minimum distance between the first thumb to the second. */
  minGap: propTypes.number,
  /** For css customization. */
  containerClassName: propTypes.string,
}

export default RangeSlider
