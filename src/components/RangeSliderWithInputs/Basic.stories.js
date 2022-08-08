import React, { useState } from 'react'
import RangeSliderWithInputs from './RangeSliderWithInputs'

export default {
  title: 'User Inputs/RangeSliderWithInputs',
  component: RangeSliderWithInputs,
}

const style = { width: '100%', height: '200px' }

export const Default = () => {
  const [value, setValue] = useState([30, 45])

  const onChange = data => {
    setValue(data)
  }

  return (
    <div style={style}>
      <RangeSliderWithInputs onChange={onChange} sliderValue={value} />
    </div>
  )
}

export const SingleValue = () => {
  const [value, setValue] = useState(30)

  const onChange = data => {
    setValue(data)
  }

  return (
    <div style={style}>
      <RangeSliderWithInputs onChange={onChange} sliderValue={value} />
    </div>
  )
}
