import React, { useState } from 'react'
import { useChannel } from '@storybook/api'
import { IconButton, Separator } from '@storybook/components'
import { addons, types } from '@storybook/addons'
import { Global } from '@storybook/theming'
import './index.scss'

const darkThemeIcon = (
  <svg focusable="false" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zM12 18c-.89 0-1.74-.2-2.5-.55C11.56 16.5 13 14.42 13 12s-1.44-4.5-3.5-5.45C10.26 6.2 11.11 6 12 6c3.31 0 6 2.69 6 6s-2.69 6-6 6z"/>
  </svg>
)

const lightThemeIcon = (
  <svg focusable="false" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zM12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/>
  </svg>
)

const ADDON_ID = 'avThemeAddon';
const iframeId = 'storybook-preview-iframe';

const AvThemeAddon = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false)
  const emit = useChannel({})
  return (
    <>
      <IconButton title={ `Toggle to ${ isDarkTheme ? 'light' : 'dark' } theme` } onClick={ () => {
        setIsDarkTheme(!isDarkTheme)
        emit('changeTheme')
      }}>
        {isDarkTheme ? lightThemeIcon : darkThemeIcon }
      </IconButton>
      <Separator/>

      <Global
        styles={() => ({
          [`#${iframeId}`]: {
            backgroundColor: isDarkTheme ? '#02244d' : '#fcfcff'
          }
        })}
      />
    </>
  )
}

addons.register(ADDON_ID, () => {
  addons.add('av-theme-addon/panel', {
    type: types.TOOL,
    render: () => <AvThemeAddon/>,
  })
})
