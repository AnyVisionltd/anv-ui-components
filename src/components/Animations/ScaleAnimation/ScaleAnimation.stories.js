import React, { useState } from 'react'
import ScaleAnimation from './ScaleAnimation'
import { Button } from '../../Button'
import { centerDecorator } from '../../../utils/storybook/decorators'
import styles from '../../../styles/storybook/index.module.scss'

export default {
  title: 'Animations/ScaleAnimation',
  component: ScaleAnimation,
  decorators: [centerDecorator],
}

export const Basic = () => {
  const [scaleConfig, setScaleConfig] = useState({
    isOpen: false,
    verticalStart: 'top',
    horizontalStart: 'start',
  })
  const { isOpen, verticalStart, horizontalStart } = scaleConfig
  const scale = (vertical, horizontal) => {
    setScaleConfig({
      isOpen: !isOpen,
      verticalStart: vertical,
      horizontalStart: horizontal,
    })
  }

  return (
    <div style={ { height: '150px' } }>
      <div className={ styles.marginFlexContainer }>
        <Button onClick={ () => scale('top', 'start') }>
          start from top, left to right
        </Button>
        <Button onClick={ () => scale('top', 'end') }>
          start from top, right to left
        </Button>
      </div>
      <div className={ styles.marginFlexContainer }>
        <Button onClick={ () => scale('bottom', 'start') }>
          start from bottom, left to right
        </Button>
        <Button onClick={ () => scale('bottom', 'end') }>
          start from bottom, right to left
        </Button>
      </div>
      <div style={ { overflow: 'hidden' } }>
        <ScaleAnimation
          isOpen={ isOpen }
          horizontalStart={ horizontalStart }
          verticalStart={ verticalStart }
        >
          <h2 style={ { textAlign: 'center' } }>Scaled text</h2>
        </ScaleAnimation>
      </div>
    </div>
  )
}
