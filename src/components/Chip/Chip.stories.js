import React from 'react'
import styleGuideColors from '@anyvision/style-guide/abstracts/_colors.scss'
import { boolean, select, text } from '@storybook/addon-knobs'
import Chip from './Chip'
import { ReactComponent as SunIcon } from '../../assets/svg/Sun.svg'
import { ReactComponent as CheckedIcon } from '../../assets/svg/Checked.svg'
import { centerDecorator } from '../../utils/storybook/decorators'
import styles from '../../styles/storybook/index.module.scss'

export default {
  title: 'Chip',
  component: Chip,
  decorators: [centerDecorator],
}

export const Default = () => (
  <Chip
    label="Chocolate"
    leadingIcon={ <SunIcon /> }
    onClick={ () => {} }
    onTrailingIconClick={ () => {} }
    deletable
  />
)

export const colors = () => Object
  .keys(styleGuideColors)
  .map((color) => (
    <Chip
      key={ color }
      color={ color }
      label={ color }
      leadingIcon={ <SunIcon /> }
      onClick={ () => {} }
      onTrailingIconClick={ () => {} }
      className={ styles.microMargin }
      deletable
    />
  ))

export const Variants = () => (
  <>
    <Chip
      label="Simple"
      className={ styles.microMargin }
    />
    <Chip
      label="Clickable"
      onClick={ () => {
      } }
      className={ styles.microMargin }
    />
    <Chip
      label="Disabled"
      className={ styles.microMargin }
      disabled
    />
    <Chip
      label="Leading Icon"
      className={ styles.microMargin }
      leadingIcon={ <SunIcon /> }
    />
    <Chip
      label="Trailing Icon"
      className={ styles.microMargin }
      trailingIcon={ <CheckedIcon /> }
    />
    <Chip
      label="Both Icons"
      className={ styles.microMargin }
      leadingIcon={ <SunIcon /> }
      trailingIcon={ <CheckedIcon /> }
    />
  </>
)

export const playground = () => {
  const leadingIcon = boolean('Display leading icon?', false)
    ? <SunIcon />
    : undefined
  const isDeletable = boolean('Will clicking on trailing icon end with deleting the chip?', true)
  const trailingIcon = boolean('Display custom trailing icon?', false)
    ? <CheckedIcon />
    : undefined
  return (
    <>
      <Chip
        label={ text('label', 'Chip') }
        color={ select('color', Object.keys(styleGuideColors), 'primary') }
        className={ styles.microMargin }
        leadingIcon={ leadingIcon }
        trailingIcon={ trailingIcon }
        onClick={ () => alert('Chip was clicked!') } // eslint-disable-line no-alert
        onTrailingIconClick={ () => alert(isDeletable ? 'Yep, will delete' : 'Trailing icon click handler!') } // eslint-disable-line no-alert
        deletable={ isDeletable }
      />
      {
        isDeletable && (
          <>
            <small className={ styles.tinyText }>
              Try focusing the chip using your keyboard, then clicking on backspace!
            </small>
          </>
        )
      }
    </>
  )
}
