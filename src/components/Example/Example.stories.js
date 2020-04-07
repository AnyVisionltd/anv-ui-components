import React from 'react'
import { text } from '@storybook/addon-knobs'

import Example from './Example'

export default {
  title: 'Components',
  component: Example
}

export const exampleTitle = () => (
  <Example
    extraText={text('extraText', '')}
    className={text('className', '')}
  />
)
