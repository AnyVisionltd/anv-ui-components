import React, { useState } from 'react'
import ScaleAnimation from './ScaleAnimation'
import { Button } from '../../index'
import { centerDecorator } from '../../utils/storybook/decorators'
import styles from '../../styles/storybook/index.module.scss'

export default {
  title: 'Animations/ScaleAnimation',
  component: ScaleAnimation,
  decorators: [centerDecorator],
}

export const Basic = () => {
  const [slide, setSlide] = useState({ isOpen: false, direction: 'up' })

  return (
    <div>
      <div className={ styles.marginFlexContainer }>
        <Button onClick={ () => setSlide({ isOpen: !slide.isOpen, direction: 'up' }) }>up</Button>
        <ScaleAnimation isOpen={ slide.isOpen }>
          <h2 style={ { textAlign: 'center' } }>Slider</h2>
        </ScaleAnimation>
      </div>
    </div>
  )
}
