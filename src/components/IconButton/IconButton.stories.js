import React from 'react'
import { select, boolean } from '@storybook/addon-knobs'
import { ReactComponent as Icon } from '../../assets/svg/Sun.svg'
import IconButton from './IconButton'

export default {
  title: 'Components/Button',
  component: IconButton,
}

export const iconButton = () => (
  <IconButton
    color={ select('color', ['primary', 'secondary', 'accent', 'decorative'], 'primary') }
    size={ select('size', ['small', 'large'], 'large') }
    variant={ select('variant', ['fill', 'outline', 'ghost'], 'fill') }
    disabled={ boolean('disabled', false) }
    icon={ Icon }
  >
    Text
  </IconButton>
)
