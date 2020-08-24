import React from 'react'
import { centerDecorator } from '../../utils/storybook/decorators'

export default {
  title: 'Style/Colors',
  decorators: [centerDecorator],
}

export const Base = () => (
  <div>
    <div>Primary</div>
    <div>Secondary</div>
    <div>Accent</div>
    <div>Decorative</div>
    <div>Content</div>
    <div>Surface</div>
    <div>Pure White</div>
    <div>True Black</div>
    <div>Success</div>
    <div>Alert</div>
    <div>Error</div>
  </div>
)

export const Additional = () => <div placeholder="Placeholder" />

export const Elevation = () => <div placeholder="Placeholder" />