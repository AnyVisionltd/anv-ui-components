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
  { myValue: 'Banana', id: 1 },
  { myValue: 'Apple', id: 2 },
  { myValue: 'Mango', id: 3 },
  { myValue: 'Blueberry', id: 4 },
  { myValue: 'Cucumber', id: 5 },
  { myValue: 'Olives', id: 6 },
  { myValue: 'Parsley', id: 7 },
  { myValue: 'Berries', id: 8 },
  { myValue: 'Raspberry', id: 9 },
  { myValue: 'Strawberry', id: 10 },
  { myValue: 'Watermelon', id: 11 },
  { myValue: 'Kiwi', id: 12 },
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
        isSelectedShownInHeader
        displayValue='myValue'
      />
    </div>
  )
}

export const MultipleWithoutSelectedInHeader = () => {
  const [, setValues] = useState([])

  const handleChange = newValues => setValues(newValues)

  return (
    <div style={containerStyle}>
      <Dropdown
        options={items}
        multiple
        label='Fruits'
        onChange={handleChange}
        isSelectedShownInHeader={false}
        displayValue='myValue'
      />
    </div>
  )
}
