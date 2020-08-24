import React from 'react'
import classNames from 'classnames'
import { centerDecorator } from '../../../utils/storybook/decorators'
import styles from './Colors.module.scss'

export default {
  title: 'Style/Colors',
  decorators: [centerDecorator],
  parameters: {
    docs: {
      page: null
    }
  },
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
  <div className={ styles.colors }>
    <div className={ styles.sirius }>Sirius</div>
    <div className={ styles.earth }>Earth</div>
    <div className={ styles.procyon }>Procyon</div>
    <div className={ styles.sun }>Sun</div>
    <div className={ styles.canopus }>Canopus</div>
    <div className={ styles.achernar }>Achernar</div>
    <div className={ styles.altair }>Altair</div>
    <div className={ styles.antares }>Antares</div>
    <div className={ styles.vega }>Vega</div>
    <div className={ styles.betelgeuse }>Betelgeuse</div>
    <div className={ styles.aldebaran }>Aldebaran</div>
    <div className={ styles.pollux }>Pollux</div>
    <div className={ styles.rigel }>Rigel</div>
    <div className={ styles.agena }>Agena</div>
    <div className={ styles.spica }>Spica</div>
    <div className={ styles.mimosa }>Mimosa</div>
  </div>
)

export const Elevation = () => (
  <div>
    <div className={ classNames(styles.colors, styles.elevation) }>
      <div className={ styles.raised }>raised</div>
      <div className={ styles.overlay }>overlay</div>
      <div className={ styles.sticky }>sticky</div>
      <div className={ styles.temporary }>temporary</div>
      <div className={ styles.popOut }>pop-out</div>
    </div>
    <center><h6>Try to use the theme toggle :)</h6></center>
  </div>
)