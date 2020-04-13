import React from 'react'
import { select, boolean } from '@storybook/addon-knobs'

import Button from './Button'

export default {
  title: 'Components/Button',
  component: Button,
}

export const button = () => (
  <Button
    color={ select('color', ['primary', 'secondary', 'accent', 'decorative'], 'primary') }
    size={ select('size', ['small', 'large'], 'large') }
    variant={ select('variant', ['fill', 'outline', 'ghost'], 'fill') }
    disabled={ boolean('disabled', false) }
  >
    Text
  </Button>
)
