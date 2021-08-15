import React, { useState, Fragment } from 'react'
import RangeSlider from './'
import { centerDecorator } from '../../utils/storybook/decorators'

export default {
  title: 'User Inputs/RangeSlider',
  component: RangeSlider,
  decorators: [centerDecorator],
}

export const Basic = () => {
  const [value1, setValue1] = useState(50)

  return (
    <RangeSlider
      min={0}
      max={100}
      value={value1}
      onChange={e => setValue1(e.target.value)}
    />
  )
}

export const DarkTheme = () => {
  const [value1, setValue1] = useState(60)
  const [value2, setValue2] = useState(0.4)

  return (
    <div style={{ backgroundColor: '#021d3d' }}>
      <RangeSlider
        min={0}
        max={100}
        value={value1}
        isDarkTheme
        onChange={e => setValue1(e.target.value)}
      />

      <RangeSlider
        min={0}
        max={1}
        value={value2}
        step={0.1}
        isDarkTheme
        onChange={e => setValue2(e.target.value)}
      />
    </div>
  )
}

export const LightTheme = () => {
  const [value1, setValue1] = useState(60)
  const [value2, setValue2] = useState(0.4)

  return (
    <>
      <RangeSlider
        min={0}
        max={100}
        value={value1}
        onChange={e => setValue1(e.target.value)}
      />

      <RangeSlider
        min={0}
        max={1}
        value={value2}
        step={0.1}
        onChange={e => setValue2(e.target.value)}
      />
    </>
  )
}

export const ToggledTooltip = () => {
  const [value, setValue] = useState(60)

  return (
    <RangeSlider
      min={0}
      max={100}
      value={value}
      onChange={e => setValue(e.target.value)}
      isToggleTooltip
    />
  )
}

export const Disabled = () => {
  const [value1, setValue1] = useState(40)
  const [value2, setValue2] = useState(60)

  return (
    <>
      <RangeSlider
        min={0}
        max={100}
        value={value1}
        disabled
        onChange={e => setValue1(e.target.value)}
      />
      <div style={{ backgroundColor: '#021d3d', marginTop: '1rem' }}>
        <RangeSlider
          min={0}
          max={100}
          value={value2}
          onChange={e => setValue2(e.target.value)}
          isDarkTheme
          disabled
        />
      </div>
    </>
  )
}

export const DifferentWidths = () => {
  const [value1, setValue1] = useState(50)
  const [value2, setValue2] = useState(50)
  const [value3, setValue3] = useState(50)
  const [value4, setValue4] = useState(50)
  const [value5, setValue5] = useState(50)
  const [value6, setValue6] = useState(50)

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}
    >
      <RangeSlider
        min={0}
        max={100}
        value={value1}
        onChange={e => setValue1(e.target.value)}
        sliderWidth={'sz144'}
      />

      <RangeSlider
        min={0}
        max={100}
        value={value2}
        onChange={e => setValue2(e.target.value)}
        sliderWidth={'sz240'}
      />

      <RangeSlider
        min={0}
        max={100}
        value={value3}
        onChange={e => setValue3(e.target.value)}
        sliderWidth={'sz320'}
      />

      <RangeSlider
        min={0}
        max={100}
        value={value4}
        onChange={e => setValue4(e.target.value)}
        sliderWidth={'sz480'}
      />

      <RangeSlider
        min={0}
        max={100}
        value={value5}
        onChange={e => setValue5(e.target.value)}
        sliderWidth={'sz640'}
      />

      <RangeSlider
        min={0}
        max={100}
        value={value6}
        onChange={e => setValue6(e.target.value)}
        sliderWidth={'sz960'}
      />
    </div>
  )
}
