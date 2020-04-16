import React from 'react'
import { select, boolean } from '@storybook/addon-knobs'
import colors from '@anyvision/style-guide/abstracts/_colors.scss'
import Button from './Button'

export default {
  title: 'Button',
  component: Button,
}

export const buttons = () => (
  <Button
    color={ select('color', Object.keys(colors), null) }
    size={ select('size', ['small', 'large'], 'large') }
    variant={ select('variant', ['fill', 'outline', 'ghost'], 'fill') }
    disabled={ boolean('disabled', false) }
  >
    Text
  </Button>
)
