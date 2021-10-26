import React, { useRef, useEffect, useState } from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import { Thumb } from './Thumb'
import keymap from '../../../utils/enums/keymap'
import styles from './DualThumb.module.scss'

const thumbsMap = {
  LOWER: 0,
  UPPER: 1,
}

const changeValuesMap = Object.freeze({
  INC: 'increase',
  DEC: 'decrease',
})

const DualThumb = ({
  SLIDER_SETTINGS,
  getPositionInSlider,
  getValueInSlider,
  values,
  renderTooltip,
  onChange,
  disabled,
  posTooltipToValue,
  countDecimals,
  step,
  min,
  max,
  minGap,
  ...inputProps
}) => {
  const barRef = useRef()
  const handleDefaultValues = () =>
    values.map((value, index) => ({
      keyName: index,
      value,
      position: getPositionInSlider(value) * 100,
    }))

  const [handleThumbsMap, setHandleThumbsMap] = useState(handleDefaultValues())
  const [activeThumb, setActiveThumb] = useState(thumbsMap.LOWER)

  useEffect(() => {
    if (!barRef.current) return
    const lowerPos = handleThumbsMap[thumbsMap.LOWER].position
    const upperPos = handleThumbsMap[thumbsMap.UPPER].position
    const { fill, background } = SLIDER_SETTINGS
    const bg = `linear-gradient(90deg, ${background} 0,
      ${background} ${lowerPos}%, ${fill} ${lowerPos}%,
      ${fill} ${upperPos}%, ${background} ${upperPos}%,
      ${background} 100%)`
    barRef.current.style.background = bg
  }, [handleThumbsMap, getPositionInSlider, SLIDER_SETTINGS])

  const updateValue = (keyIndex, value, pos) => {
    if (value < min || value > max) return
    let currentThumbsMap = [...handleThumbsMap]
    currentThumbsMap[keyIndex] = {
      ...currentThumbsMap[keyIndex],
      value,
      position: pos ?? getPositionInSlider(value) * 100,
    }

    if (
      minGap &&
      currentThumbsMap[thumbsMap.UPPER].value -
        currentThumbsMap[thumbsMap.LOWER].value <
        minGap
    )
      return

    if (
      currentThumbsMap[thumbsMap.LOWER].value >
      currentThumbsMap[thumbsMap.UPPER].value
    ) {
      const temp = thumbsMap.LOWER
      thumbsMap.LOWER = thumbsMap.UPPER
      thumbsMap.UPPER = temp
    }

    setHandleThumbsMap(currentThumbsMap)
    onChange(currentThumbsMap.map(({ value }) => value).sort((a, b) => a - b))
  }

  const handleChange = e => {
    const keyIndex = e.target.name
    setActiveThumb(keyIndex)
    const curValue = Number(e.target.value)
    updateValue(keyIndex, curValue)
  }

  const changeThumbValue = (thumbKey, changeType) => {
    const change = (changeType === changeValuesMap.INC ? 1 : -1) * step
    updateValue(thumbKey, handleThumbsMap[thumbKey].value + change)
  }

  const handleKeyPress = e => {
    switch (e.keyCode) {
      case keymap.ARROW_DOWN:
      case keymap.ARROW_LEFT:
      case keymap.PAGE_DOWN:
      case keymap.HOME:
        changeThumbValue(activeThumb, changeValuesMap.DEC)
        break
      case keymap.ARROW_UP:
      case keymap.ARROW_RIGHT:
      case keymap.PAGE_UP:
      case keymap.END:
        changeThumbValue(activeThumb, changeValuesMap.INC)
        break
      default:
        break
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress)
    document.addEventListener('keyup', handleKeyPress)

    return () => {
      document.removeEventListener('keydown', handleKeyPress)
      document.removeEventListener('keyup', handleKeyPress)
    }
  })

  const handleBarClick = e => {
    const mouseX = Number(e.nativeEvent.offsetX)
    const curPos = (mouseX / e.target.clientWidth) * 100
    const distanceFromLowerThumb = Math.abs(
      handleThumbsMap[thumbsMap.LOWER].position - curPos,
    )
    const distanceFromUpperThumb = Math.abs(
      handleThumbsMap[thumbsMap.UPPER].position - curPos,
    )

    const stepDecimalCount = countDecimals()
    const curVal = getValueInSlider(curPos)
    const updatedVal = Number(curVal.toFixed(stepDecimalCount))

    if (distanceFromLowerThumb <= distanceFromUpperThumb) {
      setActiveThumb(thumbsMap.LOWER)
      const { keyName } = handleThumbsMap[thumbsMap.LOWER]
      updateValue(keyName, updatedVal, curPos)
    } else {
      setActiveThumb(thumbsMap.UPPER)
      const { keyName } = handleThumbsMap[thumbsMap.UPPER]
      updateValue(keyName, updatedVal, curPos)
    }
  }

  return (
    <>
      <div
        className={classNames(styles.dualThumbBar, disabled && styles.disabled)}
        ref={barRef}
        onClick={handleBarClick}
      />
      {handleThumbsMap.map(thumbProps => (
        <Thumb
          key={thumbProps.keyName}
          {...thumbProps}
          {...inputProps}
          step={step}
          onChange={handleChange}
          disabled={disabled}
          renderTooltip={renderTooltip}
          posTooltipToValue={posTooltipToValue}
          min={min}
          max={max}
        />
      ))}
    </>
  )
}

DualThumb.propTypes = {
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
  /** Value of the slider */
  values: propTypes.arrayOf(propTypes.number),
  /** Determines the minimum distance between the first thumb to the second. */
  minGap: propTypes.number,
  /** Function to get position in slider from value. */
  getPositionInSlider: propTypes.func,
  /** Function to get value in slider from position. */
  getValueInSlider: propTypes.func,
  /** Function to position tooltip in the middle of the slider thumb. */
  posTooltipToValue: propTypes.func,
  /** Function to count deciamls in case there is a step prop, that is a decimal number. */
  countDecimals: propTypes.func,
  /** Function to render tootltip for thumb. */
  renderTooltip: propTypes.func,
}

export default DualThumb
