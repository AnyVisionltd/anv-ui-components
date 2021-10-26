import React, { useRef, useEffect } from 'react'
import propTypes from 'prop-types'
import styles from './Thumb.module.scss'

const Thumb = ({
  keyName,
  value,
  position,
  renderTooltip,
  posTooltipToValue,
  ...inputProps
}) => {
  const tooltipRef = useRef()

  useEffect(() => {
    if (!tooltipRef.current) return
    tooltipRef.current.style.left = `${posTooltipToValue(value)}%`
  }, [position, posTooltipToValue, value])

  return (
    <>
      <input
        type='range'
        value={value}
        name={keyName}
        className={styles.thumb}
        {...inputProps}
      />
      {renderTooltip(tooltipRef, value)}
    </>
  )
}

Thumb.propTypes = {
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
  /** Value of the thumb. */
  value: propTypes.number,
  /** Position of the thumb. */
  position: propTypes.number,
  /** Unique identifier for thumb. */
  keyName: propTypes.number,
  /** Function to position tooltip in the middle of the slider thumb. */
  posTooltipToValue: propTypes.func,
  /** Function to render tootltip for thumb. */
  renderTooltip: propTypes.func,
}

export default Thumb
