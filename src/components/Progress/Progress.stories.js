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
    if (value >= 100) return
    const interval = setInterval(() => {
      setValue(value => value + 1)
      if (value >= 100) clearInterval(interval)
    }, 30)
    return () => clearInterval(interval)
  }, [value])

  return (
    <div style={{ ...containerStyle, width: '200px' }}>
      <Progress value={value} withText success={value === 100} />
      <Progress value={value} withText error={value === 100} variant='circle' />
    </div>
  )
}

export const Variants = () => {
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

export const Error = () => {
  const [value, setValue] = useState(0)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (value >= 100 || error) return
    const interval = setInterval(() => {
      setValue(value => value + 1)
      if (value >= 100) clearInterval(interval)
    }, 300)
    return () => clearInterval(interval)
  }, [value, error])

  useEffect(() => {
    const fetchUser = () => {
      return new Promise((_, reject) => {
        setTimeout(
          () => reject({ success: false, message: 'Could not fetch user' }),
          4000,
        )
      })
    }

    fetchUser().catch(err => setError(err))
  }, [])

  return (
    <div style={{ ...containerStyle, width: '200px' }}>
      <Progress
        value={value}
        withText
        success={value === 100}
        error={error}
        errorMessage={error ? error.message : ''}
        style={{ marginBottom: '16px' }}
      />
      <Progress
        value={value}
        withText
        success={value === 100}
        error={error}
        errorMessage={error ? error.message : ''}
        variant='circle'
      />
    </div>
  )
}

export const ErrorAndSuccessResults = () => (
  <div style={containerStyle}>
    <Progress error />
    <Progress success />
    <div style={{ display: 'flex' }}>
      <Progress tiny error errorMessage='Fail' />
      <Progress tiny success successMessage='Success' />
    </div>
  </div>
)
