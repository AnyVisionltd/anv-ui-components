import React, { useRef, useEffect, useState, useCallback } from 'react'
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
  onReachingMinGap,
  containerRef,
  ...inputProps
}) => {
  const barRef = useRef()
  const handleDefaultValues = useCallback(
    () =>
      values.map((value, index) => ({
        keyName: index,
        value,
        position: getPositionInSlider(value) * 100,
      })),
    [values, getPositionInSlider],
  )

  const [handleThumbsMap, setHandleThumbsMap] = useState(handleDefaultValues())
  const [activeThumb, setActiveThumb] = useState(thumbsMap.LOWER)

  useEffect(() => {
    if (!handleThumbsMap) return
    const currentValues = [
      handleThumbsMap[thumbsMap.LOWER].value,
      handleThumbsMap[thumbsMap.UPPER].value,
    ]
    if (JSON.stringify(currentValues) !== JSON.stringify(values)) {
      const [lowerValue, upperValue] = values
      setHandleThumbsMap(prevValues =>
        prevValues.map(({ keyName, value, position }) => {
          const newValue = keyName === thumbsMap.LOWER ? lowerValue : upperValue
          if (value === newValue) {
            return { keyName, value, position }
          }
          return {
            keyName,
            value: newValue,
            position: getPositionInSlider(newValue) * 100,
          }
        }),
      )
    }
  }, [values, handleThumbsMap, getPositionInSlider, handleDefaultValues])

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
    ) {
      return onReachingMinGap()
    }

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

  const handleChange = ({ target }) => {
    const { name: keyIndex, value } = target
    setActiveThumb(keyIndex)
    const currentValue = Number(value)
    updateValue(keyIndex, currentValue)
  }

  const changeThumbValue = (thumbKey, changeType) => {
    const change = (changeType === changeValuesMap.INC ? 1 : -1) * step
    const value = handleThumbsMap[thumbKey].value + change
    const valueWithFixedDecimals = Number(value.toFixed(countDecimals()))
    updateValue(thumbKey, valueWithFixedDecimals)
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
    const container = containerRef.current
    container?.addEventListener('keydown', handleKeyPress)
    container?.addEventListener('keyup', handleKeyPress)

    return () => {
      container?.removeEventListener('keydown', handleKeyPress)
      container?.removeEventListener('keyup', handleKeyPress)
    }
  })

  const handleBarClick = e => {
    const mouseX = Number(e.nativeEvent.offsetX)
    const currentPos = (mouseX / e.target.clientWidth) * 100
    const distanceFromLowerThumb = Math.abs(
      handleThumbsMap[thumbsMap.LOWER].position - currentPos,
    )
    const distanceFromUpperThumb = Math.abs(
      handleThumbsMap[thumbsMap.UPPER].position - currentPos,
    )

    const stepDecimalCount = countDecimals()
    const curVal = getValueInSlider(currentPos)
    const updatedVal = Number(curVal.toFixed(stepDecimalCount))

    if (distanceFromLowerThumb <= distanceFromUpperThumb) {
      setActiveThumb(thumbsMap.LOWER)
      const { keyName } = handleThumbsMap[thumbsMap.LOWER]
      updateValue(keyName, updatedVal, currentPos)
    } else {
      setActiveThumb(thumbsMap.UPPER)
      const { keyName } = handleThumbsMap[thumbsMap.UPPER]
      updateValue(keyName, updatedVal, currentPos)
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
  /** Callback function that is called if the user reaches the minimum distance allowed. */
  onReachingMinGap: propTypes.func,
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
  /** Container element */
  containerRef: propTypes.shape({ current: propTypes.instanceOf(Element) }),
}

export default DualThumb
