import React, { useState } from 'react'
import { centerDecorator } from '../../utils/storybook/decorators'
import Dropdown from './Dropdown'

export default {
  title: 'Content/ Dropdown',
  component: Dropdown,
  decorators: [centerDecorator],
}

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
}

const items = [
  { value: 'Banana', id: 1 },
  { value: 'Apple', id: 2 },
  { value: 'Mango', id: 3 },
  { value: 'Blueberry', id: 4 },
]

export const Basic = () => (
  <div style={containerStyle}>
    <Dropdown options={items} />
  </div>
)
