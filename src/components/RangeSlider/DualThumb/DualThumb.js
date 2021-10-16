import React, { useRef, useEffect, useState } from 'react'
import classNames from 'classnames'
import { Thumb } from './Thumb'
import keymap from '../../../utils/enums/keymap'
import styles from './DualThumb.module.scss'

const thumbsMap = {
  LOWER: 0,
  UPPER: 1,
}

const changeValuesMap = {
  INC: 'increase',
  DEC: 'decrease',
}

const DualThumb = ({
  SLIDER_SETTINGS,
  getPositionInSlider,
  getValueInSlider,
  values,
  renderTooltip,
  onChange,
  onMouseMove,
  onMouseOut,
  disabled,
  posTooltipMiddleThumb,
  fixThumbRangeDeviation,
  countDecimals,
  step,
  ...inputProps
}) => {
  const barRef = useRef()
  const handleValues = () =>
    values.map((value, index) => ({
      keyName: index,
      value,
      position: getPositionInSlider(value) * 100,
    }))

  // Add useState to determine active thumb
  const [handleThumbsMap, setHandleThumbsMap] = useState(handleValues())

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
  }, [
    handleThumbsMap[thumbsMap.LOWER].position,
    handleThumbsMap[thumbsMap.UPPER].position,
    getPositionInSlider,
    SLIDER_SETTINGS.fill,
    SLIDER_SETTINGS.background,
  ])

  const updateValue = (keyIndex, value, pos) => {
    let curMap = [...handleThumbsMap]
    curMap[keyIndex] = {
      ...curMap[keyIndex],
      value,
      position: pos ?? getPositionInSlider(value) * 100,
    }

    if (curMap[thumbsMap.LOWER].value > curMap[thumbsMap.UPPER].value) {
      const tempVal = curMap[thumbsMap.LOWER].value
      curMap[thumbsMap.LOWER].value = curMap[thumbsMap.UPPER].value
      curMap[thumbsMap.UPPER].value = tempVal

      const tempPos = curMap[thumbsMap.LOWER].position
      curMap[thumbsMap.LOWER].position = curMap[thumbsMap.UPPER].position
      curMap[thumbsMap.UPPER].position = tempPos
    }

    setHandleThumbsMap(curMap)
    onChange(curMap.map(({ value }) => value))
  }

  const handleChange = e => {
    const keyIndex = e.target.name
    const curValue = Number(e.target.value)
    updateValue(keyIndex, curValue)
  }

  const changeThumbValue = thumbKey => changeType => {
    const change = changeType === changeValuesMap.INC ? 1 : -1
    updateValue(
      thumbKey,
      handleThumbsMap[thumbsMap.LOWER].value + change * step,
    )
  }

  const handleKeyPress = e => {
    const keyIndex = e.target.name
    const changeHandler = changeThumbValue(keyIndex)

    switch (e.keyCode) {
      case keymap.ARROW_DOWN:
      case keymap.ARROW_LEFT:
      case keymap.PAGE_DOWN:
      case keymap.HOME:
        changeHandler(changeValuesMap.DEC)
      case keymap.ARROW_UP:
      case keymap.ARROW_RIGHT:
      case keymap.PAGE_UP:
      case keymap.END:
        changeHandler(changeValuesMap.INC)
      default:
        break
    }
  }

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
      const { keyName } = handleThumbsMap[thumbsMap.LOWER]
      updateValue(keyName, updatedVal, curPos)
    } else {
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
          tabIndex={thumbProps.keyName === 1 ? '0' : '1'}
          step={step}
          onChange={handleChange}
          disabled={disabled}
          renderTooltip={renderTooltip}
          posTooltipMiddleThumb={posTooltipMiddleThumb}
          onKeyDown={handleKeyPress}
          onKeyUp={handleKeyPress}
        />
      ))}
    </>
  )
}

export default DualThumb
