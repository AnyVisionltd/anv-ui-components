import React, { useEffect, useState } from 'react'
import ProgressWithIndicator from './ProgressWithIndicator'
import { centerDecorator } from '../../utils/storybook/decorators'

export default {
  title: 'User Feedback/ProgressWithIndicator',
  component: ProgressWithIndicator,
  decorators: [centerDecorator],
}

const containerStyle = {
  width: '50%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
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
      <ProgressWithIndicator value={value} success={value === 100} />
      <ProgressWithIndicator
        value={value}
        error={value === 100}
        variant='circle'
      />
    </div>
  )
}

export const Example = () => {
  const [value, setValue] = useState(0)
  const [results, setResults] = useState({})
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (value >= 100) return
    const interval = setInterval(() => {
      setValue(value => value + 1)
      if (value >= 100) clearInterval(interval)
    }, 40)
    return () => clearInterval(interval)
  }, [value])

  useEffect(() => {
    if (index > 3) {
      setTimeout(() => {
        setResults({})
        setIndex(0)
      }, 1500)
      return
    }
    const fetchUser = () => {
      return new Promise((resolve, reject) => {
        setTimeout(
          () =>
            Math.random() > 0.5
              ? resolve({ success: true, message: 'Fetched successfuly' })
              : reject({ success: false, message: 'Could not fetch user' }),
          3000,
        )
      })
    }

    fetchUser()
      .then(res => setResults({ ...results, [index]: res }))
      .catch(err => setResults({ ...results, [index]: err }))
      .finally(() => {
        setIndex(index + 1)
        setValue(0)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  const renderProgress = keyIndex => (
    <ProgressWithIndicator
      key={keyIndex}
      value={value}
      errorMessage={results[keyIndex]?.message}
      successMessage={results[keyIndex]?.message}
      error={results[keyIndex]?.success === false}
      success={results[keyIndex]?.success === true}
      inQueue={index < keyIndex}
      style={{ marginBottom: '16px' }}
    />
  )

  const style = {
    ...containerStyle,
    justifyContent: 'flexStart',
    alignItems: 'start',
  }

  return (
    <div style={style}>
      {[...new Array(4)].map((_, index) => renderProgress(index))}
    </div>
  )
}

export const ExampleTiny = () => {
  const [value, setValue] = useState(0)
  const [results, setResults] = useState({})
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (value >= 100) return
    const interval = setInterval(() => {
      setValue(value => value + 1)
      if (value >= 100) clearInterval(interval)
    }, 40)
    return () => clearInterval(interval)
  }, [value])

  useEffect(() => {
    if (index > 3) {
      setTimeout(() => {
        setResults({})
        setIndex(0)
      }, 1500)
      return
    }
    const fetchUser = () => {
      return new Promise((resolve, reject) => {
        setTimeout(
          () =>
            Math.random() > 0.5
              ? resolve({ success: true, message: 'Fetched successfuly' })
              : reject({ success: false, message: 'Could not fetch user' }),
          3000,
        )
      })
    }

    fetchUser()
      .then(res => setResults({ ...results, [index]: res }))
      .catch(err => setResults({ ...results, [index]: err }))
      .finally(() => {
        setIndex(index + 1)
        setValue(0)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  const renderTinyProgress = keyIndex => (
    <ProgressWithIndicator
      key={keyIndex}
      isTiny
      value={value}
      errorMessage={results[keyIndex]?.message}
      successMessage={results[keyIndex]?.message}
      error={results[keyIndex]?.success === false}
      success={results[keyIndex]?.success === true}
      inQueue={index < keyIndex}
      style={{ marginBottom: '16px' }}
    />
  )

  const style = {
    ...containerStyle,
    justifyContent: 'flexStart',
    alignItems: 'start',
  }

  return (
    <div style={style}>
      <div style={{ width: '28px' }}>
        {[...new Array(4)].map((_, index) => renderTinyProgress(index))}
      </div>
    </div>
  )
}
