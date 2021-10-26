import React, { useEffect, useRef } from 'react'
import propTypes from 'prop-types'
import styles from './SingleThumb.module.scss'

const SingleThumb = ({
  SLIDER_SETTINGS,
  getPositionInSlider,
  value,
  isToggleTooltip,
  showTooltip,
  hoverPos,
  renderTooltip,
  ...inputProps
}) => {
  const sliderRef = useRef()
  const tooltipRef = useRef()

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

  useEffect(() => {
    if (!tooltipRef.current) return
    if (isToggleTooltip && !showTooltip) return
    const tooltipPos = hoverPos ?? 100 * getPositionInSlider(value)
    tooltipRef.current.style.left = `${tooltipPos}%`
  }, [showTooltip, hoverPos, isToggleTooltip, value, getPositionInSlider])

  return (
    <>
      <input
        className={styles.singleThumbRange}
        type='range'
        value={value}
        ref={sliderRef}
        {...inputProps}
      />
      {renderTooltip(tooltipRef)}
    </>
  )
}

SingleThumb.propTypes = {
  /** The min value of the range. */
  min: propTypes.number,
  /** The max value of the range. */
  max: propTypes.number,
  /** Callback when the component's state is changed. */
  onChange: propTypes.func,
  /** The step by which the value is incremented / decremented. */
  step: propTypes.number,
  /** Determines the disabled mode of the RangeSlider, if true - disabled. */
  disabled: propTypes.bool,
  /** Settings of the slider. */
  SLIDER_SETTINGS: propTypes.object,
  /** Wether to show tooltip or not. */
  showTooltip: propTypes.bool,
  /** Function to get position in slider from value. */
  getPositionInSlider: propTypes.func,
  /** Value of the slider */
  value: propTypes.oneOfType([propTypes.string, propTypes.number]),
  /** Function to render tootltip for thumb. */
  renderTooltip: propTypes.func,
  /** Wether tooltip is always shown or not. */
  isToggleTooltip: propTypes.bool,
  /** Value of mouse position when user hoveres the slider. */
  hoverPos: propTypes.number,
  /** Function to handle keydown events. */
  onKeyDown: propTypes.func,
  /** Function to handle keyup events. */
  onKeyUp: propTypes.func,
}

export default SingleThumb
