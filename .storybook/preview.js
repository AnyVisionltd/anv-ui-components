import { addParameters, addDecorator } from '@storybook/react';
import avTheme from './av-theme-addon/decorator'

addParameters({
  options: {
    storySort: {
      order: ['Style', 'Components', "Icons"],
    },
  },
})

addDecorator(avTheme)
