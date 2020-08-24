import React from 'react'
import { centerDecorator } from '../../../utils/storybook/decorators'
import styles from './Colors.module.scss'

export default {
  title: 'Style/Colors',
  decorators: [centerDecorator],
}

export const Base = () => (
  <div className={ styles.colors }>
    <div className={ styles.primary }>Primary</div>
    <div className={ styles.secondary }>Secondary</div>
    <div className={ styles.accent }>Accent</div>
    <div className={ styles.decorative }>Decorative</div>
    <div className={ styles.content }>Content</div>
    <div className={ styles.surface }>Surface</div>
    <div className={ styles.purewhite }>Pure White</div>
    <div className={ styles.trueblack }>True Black</div>
    <div className={ styles.success }>Success</div>
    <div className={ styles.alert }>Alert</div>
    <div className={ styles.error }>Error</div>
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