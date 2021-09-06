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
  { value: 'Cucumber', id: 5 },
  { value: 'Olives', id: 6 },
  { value: 'Parsley', id: 7 },
  { value: 'Berries', id: 8 },
  { value: 'Raspberry', id: 9 },
  { value: 'Strawberry', id: 10 },
  { value: 'Watermelon', id: 11 },
  { value: 'Kiwi', id: 12 },
]

const genders = [
  { value: 'Male', id: 1 },
  { value: 'Female', id: 2 },
]

export const Basic = () => (
  <div style={containerStyle}>
    <Dropdown options={genders} label='Gender' defaultValues={[genders[0]]} />
  </div>
)

export const Multiple = () => {
  const [, setValues] = useState([])

  const handleChange = newValues => setValues(newValues)

  return (
    <div style={containerStyle}>
      <Dropdown
        options={items}
        multiple
        label='Fruits'
        onChange={handleChange}
      />
    </div>
  )
}
