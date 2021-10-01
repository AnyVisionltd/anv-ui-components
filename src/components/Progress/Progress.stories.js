import React, { useEffect, useState } from 'react'
import Progress from './Progress'
import { centerDecorator } from '../../utils/storybook/decorators'

export default {
  title: 'User Feedback/Progress',
  component: Progress,
  decorators: [centerDecorator],
}

const containerStyle = {
  width: '50%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
}

const textStyle = {
  marginTop: '10px',
  textTransform: 'uppercase',
}

export const Basic = () => {
  const [value, setValue] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      const newValue =
        value >= 100 ? 0 : value + Math.floor(Math.random() * 10 + 10)
      setValue(newValue)
    }, 2000)
    return () => clearInterval(interval)
  }, [value])

  return (
    <div style={containerStyle}>
      <h2 style={textStyle}>line</h2>
      <Progress value={value} />
      <h2 style={textStyle}>circle</h2>
      <Progress variant={'circle'} value={value} />
    </div>
  )
}

export const Indeterminate = () => (
  <div style={containerStyle}>
    <h2 style={textStyle}>line</h2>
    <Progress indeterminate />
    <h2 style={textStyle}>circle</h2>
    <Progress indeterminate variant={'circle'} />
  </div>
)

export const PlayGround = args => <Progress {...args} />
PlayGround.args = { value: 25 }
