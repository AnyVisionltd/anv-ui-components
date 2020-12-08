import React from 'react'
import { boolean, text } from '@storybook/addon-knobs'
import Chip from './Chip'
import { SunBrightens } from '@anyvision/anv-icons'
import { ReactComponent as CheckedIcon } from '../../assets/svg/Checked.svg'
import { centerDecorator } from '../../utils/storybook/decorators'
import styles from '../../storybook/index.module.scss'

export default {
  title: 'Content/Chip',
  component: Chip,
  decorators: [centerDecorator],
}

export const Default = () => (
  <Chip
    label='Chocolate'
    leadingIcon={<SunBrightens />}
    onClick={() => {}}
    onTrailingIconClick={() => {}}
    deletable
  />
)

export const Variants = () => (
  <>
    <Chip label='Simple' className={styles.microMargin} />
    <Chip label='Clickable' onClick={() => {}} className={styles.microMargin} />
    <Chip label='Disabled' className={styles.microMargin} disabled />
    <Chip
      label='Leading Icon'
      className={styles.microMargin}
      leadingIcon={<SunBrightens />}
    />
    <Chip
      label='Trailing Icon'
      className={styles.microMargin}
      trailingIcon={<CheckedIcon />}
    />
    <Chip
      label='Both Icons'
      className={styles.microMargin}
      leadingIcon={<SunBrightens />}
      trailingIcon={<CheckedIcon />}
    />
  </>
)

export const playground = () => {
  const leadingIcon = boolean('Display leading icon?', false) ? (
    <SunBrightens />
  ) : null
  const isDeletable = boolean(
    'Will clicking on trailing icon end with deleting the chip?',
    true,
  )
  const trailingIcon = boolean('Display custom trailing icon?', false) ? (
    <CheckedIcon />
  ) : null
  return (
    <>
      <Chip
        label={text('label', 'Chip')}
        className={styles.microMargin}
        leadingIcon={leadingIcon}
        trailingIcon={trailingIcon}
        onClick={() => alert('Chip was clicked!')} // eslint-disable-line no-alert
        onTrailingIconClick={() =>
          alert(
            isDeletable ? 'Yep, will delete' : 'Trailing icon click handler!',
          )
        } // eslint-disable-line no-alert
        deletable={isDeletable}
      />
      {isDeletable && (
        <>
          <small className={styles.tinyText}>
            Try focusing the chip using your keyboard, then clicking on
            backspace!
          </small>
        </>
      )}
    </>
  )
}
