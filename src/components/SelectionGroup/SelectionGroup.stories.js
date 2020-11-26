import React, { useState } from 'react'
import { SunBrightens } from '@anyvision/anv-icons'
import { action } from '@storybook/addon-actions'
import { SelectionGroup } from '../../index'
import { centerDecorator } from '../../utils/storybook/decorators'
import { boolean, select } from '@storybook/addon-knobs'

export default {
  title: 'Components/SelectionGroup',
  component: SelectionGroup,
  decorators: [centerDecorator],
  subcomponents: {
    Item: SelectionGroup.Item,
  },
}

const containerStyle = {
  display: 'grid',
  gridGap: '8px',
}

const flexContainer = {
  display: 'flex',
  justifyContent: 'center',
}

export const Default = () => {
  return (
    <SelectionGroup defaultValue={2}>
      <SelectionGroup.Item value={1}>One</SelectionGroup.Item>
      <SelectionGroup.Item value={2}>Two</SelectionGroup.Item>
      <SelectionGroup.Item value={3}>Three</SelectionGroup.Item>
    </SelectionGroup>
  )
}

export const Controlled = () => {
  const [value, setValue] = useState(1)
  return (
    <SelectionGroup onChange={setValue} value={value}>
      <SelectionGroup.Item value={1}>One</SelectionGroup.Item>
      <SelectionGroup.Item value={2}>Two</SelectionGroup.Item>
      <SelectionGroup.Item value={3}>Three</SelectionGroup.Item>
    </SelectionGroup>
  )
}

export const Variants = () => (
  <div style={containerStyle}>
    <SelectionGroup defaultValue={1}>
      <SelectionGroup.Item value={1}>One</SelectionGroup.Item>
      <SelectionGroup.Item value={2}>Two</SelectionGroup.Item>
      <SelectionGroup.Item value={3}>Three</SelectionGroup.Item>
    </SelectionGroup>

    <SelectionGroup variant={'round'} defaultValue={1}>
      <SelectionGroup.Item value={1}>One</SelectionGroup.Item>
      <SelectionGroup.Item value={2}>Two</SelectionGroup.Item>
      <SelectionGroup.Item value={3}>Three</SelectionGroup.Item>
    </SelectionGroup>

    <SelectionGroup variant={'ghost'} defaultValue={1}>
      <SelectionGroup.Item value={1}>One</SelectionGroup.Item>
      <SelectionGroup.Item value={2}>Two</SelectionGroup.Item>
      <SelectionGroup.Item value={3}>Three</SelectionGroup.Item>
    </SelectionGroup>
  </div>
)

export const WithIcon = () => (
  <div style={containerStyle}>
    <SelectionGroup defaultValue={1}>
      <SelectionGroup.Item value={1} leadingIcon={<SunBrightens />}>
        One
      </SelectionGroup.Item>
      <SelectionGroup.Item value={2} leadingIcon={<SunBrightens />}>
        Two
      </SelectionGroup.Item>
      <SelectionGroup.Item value={3} leadingIcon={<SunBrightens />}>
        Three
      </SelectionGroup.Item>
    </SelectionGroup>

    <div style={flexContainer}>
      <SelectionGroup defaultValue={1}>
        <SelectionGroup.Item value={1}>
          <SunBrightens />
        </SelectionGroup.Item>
        <SelectionGroup.Item value={2}>
          <SunBrightens />
        </SelectionGroup.Item>
        <SelectionGroup.Item value={3}>
          <SunBrightens />
        </SelectionGroup.Item>
      </SelectionGroup>
    </div>
  </div>
)

export const Disabled = () => (
  <div style={containerStyle}>
    <SelectionGroup defaultValue={1}>
      <SelectionGroup.Item value={1}>One</SelectionGroup.Item>
      <SelectionGroup.Item value={2} disabled>
        Two
      </SelectionGroup.Item>
      <SelectionGroup.Item value={3}>Three</SelectionGroup.Item>
    </SelectionGroup>

    <SelectionGroup defaultValue={1} disabled>
      <SelectionGroup.Item value={1}>One</SelectionGroup.Item>
      <SelectionGroup.Item value={2}>Two</SelectionGroup.Item>
      <SelectionGroup.Item value={3}>Three</SelectionGroup.Item>
    </SelectionGroup>
  </div>
)

export const Playground = () => {
  const withIcon = boolean('withIcon', false)
  const withLeadingIcon = !withIcon && boolean('leadingIcon', false)

  return (
    <SelectionGroup
      defaultValue={1}
      variant={select('variant', ['sharp', 'round', 'ghost'], 'sharp')}
      disabled={boolean('disabled', false)}
      onChange={action('changed')}
    >
      <SelectionGroup.Item
        value={1}
        leadingIcon={withLeadingIcon && <SunBrightens />}
      >
        {withIcon ? <SunBrightens /> : 'One'}
      </SelectionGroup.Item>
      <SelectionGroup.Item
        value={2}
        leadingIcon={withLeadingIcon && <SunBrightens />}
      >
        {withIcon ? <SunBrightens /> : 'Two'}
      </SelectionGroup.Item>
      <SelectionGroup.Item
        value={3}
        leadingIcon={withLeadingIcon && <SunBrightens />}
      >
        {withIcon ? <SunBrightens /> : 'Three'}
      </SelectionGroup.Item>
    </SelectionGroup>
  )
}
