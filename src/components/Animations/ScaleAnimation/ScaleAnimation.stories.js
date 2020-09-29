import React, { useState } from 'react'
import ScaleAnimation from './ScaleAnimation'
import { Button } from '../../Button'
import { centerDecorator } from '../../../utils/storybook/decorators'
import styles from '../../../storybook/index.module.scss'

export default {
  title: 'Animations/Scale',
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
  const scale = (vertical = 'center', horizontal = 'center') => {
    setScaleConfig({
      isOpen: !isOpen,
      verticalStart: vertical,
      horizontalStart: horizontal,
    })
  }

  return (
    <div style={ {
      height: '250px', display: 'flex', flexDirection: 'column', alignItems: 'center',
    } }
    >
      <div className={ styles.marginFlexContainer }>
        <Button onClick={ () => scale('top', 'start') }>
          start from top, left to right
        </Button>
        <Button onClick={ () => scale('top') }>
          start from top, center
        </Button>
        <Button onClick={ () => scale('top', 'end') }>
          start from top, right to left
        </Button>
      </div>
      <div className={ styles.marginFlexContainer }>
        <Button onClick={ () => scale('center', 'start') }>
          start from the middle, left to right
        </Button>
        <Button onClick={ () => scale() }>
          pop from center
        </Button>
        <Button onClick={ () => scale('center', 'end') }>
          start from middle, right to left
        </Button>
      </div>
      <div className={ styles.marginFlexContainer }>
        <Button onClick={ () => scale('bottom', 'start') }>
          start from bottom, left to right
        </Button>
        <Button onClick={ () => scale('bottom') }>
          start from bottom, center
        </Button>
        <Button onClick={ () => scale('bottom', 'end') }>
          start from bottom, right to left
        </Button>
      </div>
      <div className={ styles.marginFlexContainer }>
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
