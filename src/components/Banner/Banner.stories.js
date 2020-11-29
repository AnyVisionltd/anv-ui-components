import React, { useState } from 'react'
import { select, text, boolean } from '@storybook/addon-knobs'
import { ReactComponent as SunIcon } from '../../assets/svg/Sun.svg'
import { centerDecorator } from '../../utils/storybook/decorators'
import { Button } from '../../index'
import Banner from './Banner'

export default {
  title: 'Content/Banner',
  component: Banner,
  decorators: [centerDecorator],
}

const myButton = <Button variant={'ghost'}>Congrats</Button>

export const Default = () => {
  const [isOpen, setOpenBanner] = useState(false)
  return (
    <React.Fragment>
      <Banner isOpen={isOpen}>{text('text', 'Banner Text')}</Banner>
      <Button onClick={() => setOpenBanner(!isOpen)}>
        Click to toggle Banner
      </Button>
    </React.Fragment>
  )
}

export const withLeadingIcon = () => (
  <React.Fragment>
    <Banner isOpen leadingIcon={<SunIcon />}>
      {text('text', 'Banner Text')}
    </Banner>
  </React.Fragment>
)

export const withTrailingComponent = () => {
  return (
    <React.Fragment>
      <Banner isOpen trailingComponent={myButton}>
        {text('text', 'Banner Text')}
      </Banner>
    </React.Fragment>
  )
}

export const PlayGround = () => {
  const withIcon = boolean('leading icon', false)
  const withTrailingComponent = boolean('trailing component', false)
  return (
    <React.Fragment>
      <Banner
        isOpen
        leadingIcon={withIcon ? <SunIcon /> : null}
        trailingComponent={withTrailingComponent ? myButton : null}
        type={select(
          'type',
          ['info', 'warning', 'error', 'success'],
          'warning',
        )}
      >
        {text('text', 'Banner Text')}
      </Banner>
    </React.Fragment>
  )
}
