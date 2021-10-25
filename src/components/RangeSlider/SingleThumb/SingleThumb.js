import React, { useEffect, useRef } from 'react'
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

export default SingleThumb
