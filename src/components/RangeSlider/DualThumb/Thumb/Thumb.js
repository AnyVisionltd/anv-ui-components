import React, { useRef, useEffect } from 'react'
import styles from './Thumb.module.scss'

const Thumb = ({
  keyName,
  value,
  position,
  renderTooltip,
  posTooltipMiddleThumb,
  ...inputProps
}) => {
  const tooltipRef = useRef()

  useEffect(() => {
    if (!tooltipRef.current) return
    tooltipRef.current.style.left = `${posTooltipMiddleThumb(position)}%`
  }, [position, posTooltipMiddleThumb])

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

export default Thumb
