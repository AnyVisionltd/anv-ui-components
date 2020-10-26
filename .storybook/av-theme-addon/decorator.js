import React, { useState, useEffect, useCallback } from 'react'
import addons from '@storybook/addons'
import './index.scss'

const avTheme = storyFn => {
  document.body.classList.add('light')
  const channel = addons.getChannel()
  const [isDarkTheme, setIsDarkTheme] = useState(false)

  const handleThemeChange = useCallback(
    isDarkTheme => setIsDarkTheme(isDarkTheme),
    [isDarkTheme],
  )

  useEffect(() => {
    channel.on('changeTheme', handleThemeChange)

    return () =>
      channel.off('changeTheme', isDarkTheme => handleThemeChange(isDarkTheme))
  }, [handleThemeChange])

  isDarkTheme
    ? document.body.classList.add('dark')
    : document.body.classList.remove('dark')

  return <div>{storyFn()}</div>
}

export default avTheme
