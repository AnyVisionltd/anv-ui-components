import React, { useState } from 'react'
import Slide from './Slide'
import { Button } from '../../index'
import { centerDecorator } from '../../utils/storybook/decorators'

export default {
  title: 'Slide',
  component: Slide,
  decorators: [centerDecorator],
}

export const Basic = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <Button onClick={ () => setIsOpen(!isOpen) }>Open</Button>
      <Slide isOpen={ isOpen }>
        <div>Slide Up</div>
      </Slide>

      <Slide isOpen={ isOpen } direction="down">
        <div>Slide Down</div>
      </Slide>

      <Slide isOpen={ isOpen } direction="left">
        <div>Slide Left</div>
      </Slide>

      <Slide isOpen={ isOpen } direction="right">
        <div>Slide Right</div>
      </Slide>
    </div>
  )
}
