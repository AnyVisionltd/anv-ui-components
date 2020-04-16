import React from 'react'
import { select, boolean } from '@storybook/addon-knobs'
import colors from '@anyvision/style-guide/abstracts/_colors.scss'
import { ReactComponent as Icon } from '../../assets/svg/Sun.svg'
import IconButton from './IconButton'

export default {
  title: 'Components/Button',
  component: IconButton,
}

export const iconButton = () => (
  <IconButton
    color={ select('color', Object.keys(colors), 'primary') }
    size={ select('size', ['small', 'large'], 'small') }
    variant={ select('variant', ['fill', 'outline', 'ghost'], 'fill') }
    disabled={ boolean('disabled', false) }
    icon={ Icon }
  />
)
