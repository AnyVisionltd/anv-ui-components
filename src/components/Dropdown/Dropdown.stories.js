import React, { useState } from 'react'
import { centerDecorator } from '../../utils/storybook/decorators'
import { Chip } from '../../index'
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
  { myValue: 'Mango', id: 3, disabled: true },
  { myValue: 'Blueberry', id: 4 },
  { myValue: 'Cucumber', id: 5 },
  { myValue: 'Olives', id: 6, disabled: true },
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
  { value: 'I do not know', id: 3, disabled: true },
  { value: 'Very very very very very very very long paragraph', id: 3 },
]

export const Basic = () => {
  const [, setValues] = useState([])
  const handleChange = newValues => setValues(newValues)

  return (
    <div style={{ ...containerStyle, marginBottom: '200px' }}>
      <Dropdown options={genders} label='Gender' defaultValues={[genders[0]]} />
    </div>
  )
}

export const Multiple = () => {
  const [, setValues] = useState([])
  const handleChange = newValues => setValues(newValues)

  return (
    <div style={{ ...containerStyle, marginBottom: '240px' }}>
      <Dropdown
        style={{ width: '420px' }}
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

export const MultipleWithSelectedInHeader = () => {
  const [, setValues] = useState([])
  const handleChange = newValues => setValues(newValues)

  return (
    <div style={{ ...containerStyle, marginBottom: '240px' }}>
      <Dropdown
        style={{ width: '450px' }}
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

export const ValueRender = () => {
  const [, setValues] = useState([])
  const handleChange = newValues => setValues(newValues)

  return (
    <div style={{ ...containerStyle, marginBottom: '240px' }}>
      <Dropdown
        multiple
        options={items}
        label='Fruits'
        displayValue='myValue'
        valueRender={value => <Chip label={value} />}
      />
    </div>
  )
}

export const Disabled = () => (
  <div style={containerStyle}>
    <Dropdown
      options={genders}
      label='Gender'
      defaultValues={[genders[0]]}
      isDisabled
    />
  </div>
)
