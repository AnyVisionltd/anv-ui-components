import React, { useEffect, useState } from 'react'
import Progress from './Progress'
import { centerDecorator } from '../../utils/storybook/decorators'

export default {
  title: 'User Feedback/Progress',
  component: Progress,
  decorators: [centerDecorator],
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
    <>
      <Progress value={value} />
      <Progress variant={'circle'} value={value} />
    </>
  )
}

export const Indeterminate = () => {
  return (
    <>
      <Progress />
      <Progress variant={'circle'} />
    </>
  )
}

export const PlayGround = args => <Progress {...args} />
