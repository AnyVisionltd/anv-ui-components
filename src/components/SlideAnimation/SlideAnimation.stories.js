import React, { useState } from 'react'
import SlideAnimation from './SlideAnimation'
import { Button } from '../../index'
import { centerDecorator } from '../../utils/storybook/decorators'
import styles from '../../styles/storybook/index.module.scss'

export default {
  title: 'Animations|SlideAnimation',
  component: SlideAnimation,
  decorators: [centerDecorator],
}

export const Basic = () => {
  const [slide, setSlide] = useState({ isOpen: false, direction: 'up' })

  return (
    <div>
      <div className={ styles.marginFlexContainer }>
        <Button onClick={ () => setSlide({ isOpen: !slide.isOpen, direction: 'up' }) }>up</Button>
        <Button onClick={ () => setSlide({ isOpen: !slide.isOpen, direction: 'down' }) }>down</Button>
        <Button onClick={ () => setSlide({ isOpen: !slide.isOpen, direction: 'left' }) }>left</Button>
        <Button onClick={ () => setSlide({ isOpen: !slide.isOpen, direction: 'right' }) }>right</Button>
      </div>
      <div style={ { overflow: 'hidden' } }>
        <SlideAnimation isOpen={ slide.isOpen } direction={ slide.direction }>
          <h2 style={ { textAlign: 'center' } }>Slider</h2>
        </SlideAnimation>
      </div>
    </div>
  )
}
