import { addParameters, addDecorator } from '@storybook/react';
import avTheme from './av-theme-addon/decorator'

addParameters({
  options: {
    showRoots: true,
    enableShortcuts: false,
    storySort: {
      order: ['Style', 'Components'],
    },
  },
})

addDecorator(avTheme)
