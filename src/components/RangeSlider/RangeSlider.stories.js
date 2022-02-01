import React, { useState } from 'react'
import RangeSlider from './RangeSlider'
import { centerDecorator } from '../../utils/storybook/decorators'

export default {
  title: 'User Inputs/RangeSlider',
  component: RangeSlider,
  decorators: [centerDecorator],
}

export const Basic = () => {
  const [value, setValue] = useState(50)

  return (
    <div style={{ width: '480px' }}>
      <RangeSlider
        min={0}
        max={100}
        value={value}
        onChange={e => setValue(e.target.value)}
      />
    </div>
  )
}

export const DualThumbRange = () => {
  const [value, setValue] = useState([40, 65])

  return (
    <div style={{ width: '480px' }}>
      <RangeSlider
        min={0}
        max={100}
        value={value}
        onChange={newValue => setValue(newValue)}
      />
    </div>
  )
}

export const DualThumbRangeWithMinimumGap = () => {
  const [value, setValue] = useState([21, 36])

  return (
    <div style={{ width: '480px' }}>
      <RangeSlider
        min={0}
        max={100}
        minGap={15}
        value={value}
        onChange={newValue => setValue(newValue)}
      />
    </div>
  )
}

export const ToggledTooltip = () => {
  const [value, setValue] = useState(60)

  return (
    <div style={{ width: '480px' }}>
      <RangeSlider
        min={0}
        max={100}
        value={value}
        onChange={e => setValue(e.target.value)}
        isToggleTooltip
      />
    </div>
  )
}

export const Disabled = () => {
  const [value, setValue] = useState(40)
  const [value2, setValue2] = useState([10, 50])

  return (
    <div style={{ width: '480px' }}>
      <RangeSlider
        min={0}
        max={100}
        value={value}
        disabled
        onChange={e => setValue(e.target.value)}
      />
      <RangeSlider
        min={0}
        max={100}
        value={value}
        disabled
        isToggleTooltip
        onChange={e => setValue(e.target.value)}
      />
      <RangeSlider
        min={0}
        max={100}
        value={value2}
        disabled
        onChange={newValue => setValue2(newValue)}
      />
    </div>
  )
}

export const DifferentSteps = () => {
  const [value1, setValue1] = useState(42)
  const [value2, setValue2] = useState(50)
  const [value3, setValue3] = useState(0.4)
  const [value4, setValue4] = useState(0.55)
  const [value5, setValue5] = useState(0.632)

  return (
    <div style={{ width: '480px' }}>
      <RangeSlider
        min={0}
        max={100}
        value={value1}
        step={2}
        onChange={e => setValue1(e.target.value)}
      />

      <RangeSlider
        min={0}
        max={100}
        value={value2}
        step={1}
        onChange={e => setValue2(e.target.value)}
      />

      <RangeSlider
        min={0}
        max={1}
        value={value3}
        onChange={e => setValue3(e.target.value)}
        step={0.1}
      />

      <RangeSlider
        min={0}
        max={1}
        value={value4}
        onChange={e => setValue4(e.target.value)}
        step={0.01}
      />

      <RangeSlider
        min={0}
        max={1}
        value={value5}
        onChange={e => setValue5(e.target.value)}
        step={0.001}
      />
    </div>
  )
}

export const DifferentMeasureUnits = () => {
  const [value1, setValue1] = useState(10)
  const [value2, setValue2] = useState(30)

  return (
    <div style={{ width: '480px' }}>
      <RangeSlider
        min={0}
        max={24}
        value={value1}
        step={1}
        onChange={e => setValue1(e.target.value)}
        measureUnitText={'H'}
      />

      <RangeSlider
        min={0}
        max={60}
        value={value2}
        step={1}
        onChange={e => setValue2(e.target.value)}
        measureUnitText={'min'}
      />
    </div>
  )
}

export const RangeWithDurationUnit = () => {
  const min = 0
  const max = 240
  const step = Math.floor((max - min) / 100)
  const [value, setValue] = useState(step * 50)

  return (
    <div style={{ width: '480px' }}>
      <RangeSlider
        min={0}
        max={240}
        step={step}
        value={value}
        onChange={e => setValue(e.target.value)}
        isDuration={true}
      />
    </div>
  )
}

export const DualThumbRangeWithDurationUnit = () => {
  const min = 0
  const max = 240
  const step = Math.floor((max - min) / 100)
  const [value, setValue] = useState([step * 40, step * 80])

  return (
    <div style={{ width: '480px' }}>
      <RangeSlider
        min={0}
        max={240}
        step={step}
        value={value}
        onChange={newValue => setValue(newValue)}
        isDuration={true}
      />
    </div>
  )
}
