import React from 'react'
import { select, boolean } from '@storybook/addon-knobs'
import styleGuideColors from '@anyvision/style-guide/abstracts/_colors.scss'
import { ReactComponent as SunIcon } from '../../assets/svg/Sun.svg'
import IconButton from './IconButton'
import styles from '../../styles/storybook/index.module.scss'
import { centerDecorator } from '../../utils/storybook/decorators'

export default {
  title: 'IconButton',
  component: IconButton,
  decorators: [centerDecorator],
}

export const Default = () => (
  <IconButton>
    <SunIcon />
  </IconButton>
)

export const colors = () => (Object.keys(styleGuideColors).map((color) => (
  <IconButton className={ styles.microMargin } key={ color } color={ color }>
    <SunIcon />
  </IconButton>
))
)

export const variants = () => (['fill', 'outline', 'ghost'].map((variant) => (
  <IconButton className={ styles.microMargin } key={ variant } variant={ variant }>
    <SunIcon />
  </IconButton>
))
)

export const sizes = () => (
  <>
    <IconButton className={ styles.microMargin }><SunIcon /></IconButton>
    <IconButton className={ styles.microMargin } size="large"><SunIcon /></IconButton>
  </>
)


export const disable = () => (
  <>
    <IconButton className={ styles.microMargin }><SunIcon /></IconButton>
    <IconButton className={ styles.microMargin } disabled><SunIcon /></IconButton>
  </>
)

export const playGround = () => (
  <IconButton
    color={ select('color', Object.keys(styleGuideColors), 'primary') }
    size={ select('size', ['small', 'large'], 'small') }
    variant={ select('variant', ['fill', 'outline', 'ghost'], 'fill') }
    disabled={ boolean('disabled', false) }
  >
    <SunIcon />
  </IconButton>
)
