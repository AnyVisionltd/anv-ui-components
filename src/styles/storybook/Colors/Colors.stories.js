import React from 'react'
import { centerDecorator } from '../../../utils/storybook/decorators'

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

export const Additional = () => (
  <div>
    <div>Sirius</div>
    <div>Earth</div>
    <div>Procyon</div>
    <div>Sun</div>
    <div>Canopus</div>
    <div>Achernar</div>
    <div>Altair</div>
    <div>Antares</div>
    <div>Vega</div>
    <div>Betelgeuse</div>
    <div>Aldebaran</div>
    <div>Pollux</div>
    <div>Rigel</div>
    <div>Agena</div>
    <div>Spica</div>
    <div>Mimosa</div>
  </div>
)

export const Elevation = () => <div placeholder="Placeholder" />