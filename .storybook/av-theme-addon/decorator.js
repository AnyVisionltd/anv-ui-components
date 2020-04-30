import React, { useState, useEffect, useCallback } from 'react';
import addons  from '@storybook/addons';
import './index.scss'

const avTheme = storyFn => {
  const channel = addons.getChannel();
  const [isDarkTheme, setIsDarkTheme] = useState(false)

  const handleThemeChange = useCallback(() => setIsDarkTheme(!isDarkTheme), [isDarkTheme])

  useEffect(() => {
    channel.on('changeTheme', handleThemeChange)

    return () => channel.off('changeTheme', handleThemeChange)
  }, [handleThemeChange])


  isDarkTheme ? document.body.classList.add('dark') : document.body.classList.remove('dark');

  return <div>{storyFn()}</div>
}

export default avTheme
