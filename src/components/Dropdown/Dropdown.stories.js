import React from 'react'
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
  { value: 'Cucumber', id: 5 },
  { value: 'Olives', id: 6 },
  { value: 'Parsley', id: 7 },
  { value: 'Berries', id: 8 },
  { value: 'Raspberry', id: 9 },
  { value: 'Strawberry', id: 10 },
  { value: 'Watermelon', id: 11 },
  { value: 'Kiwi', id: 12 },
]

const cameras = [
  { value: 'Automatic', id: 1 },
  { value: 'pipeeng-1-21-312-31-23-12321312-32123123' },
]

export const Basic = () => (
  <div style={containerStyle}>
    <Dropdown options={items} multiple label='Fruits' />
  </div>
)

export const NotMulti = () => (
  <div style={containerStyle}>
    <Dropdown options={cameras} label='Cameras' defaultValues={[cameras[0]]} />
  </div>
)
