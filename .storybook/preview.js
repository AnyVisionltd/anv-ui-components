import { addParameters, addDecorator } from '@storybook/react'
import avTheme from './av-theme-addon/decorator'

addParameters({
  options: {
    storySort: {
      order: ['Style', 'Icons', 'User Inputs', 'Content', 'User Feedback'],
    },
  },
  controls: { hideNoControlsWarning: true },
})

addDecorator(avTheme)
