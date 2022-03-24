import React, { useState } from 'react'
import { centerDecorator } from '../../utils/storybook/decorators'
import { Chip } from '../Chip'
import Autocomplete from './Autocomplete'

export default {
  title: 'Content/Autocomplete2',
  component: Autocomplete,
  decorators: [centerDecorator],
}

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  marginBottom: '240px',
}

const results = [
  { value: 'Banana', id: 1 },
  { value: 'Apple', id: 2 },
  { value: 'Mango', id: 3, disabled: true },
  { value: 'Blueberry', id: 4 },
  { value: 'Cucumber', id: 5 },
  { value: 'Olives', id: 6, disabled: true },
  { value: 'Parsley', id: 7 },
  { value: 'Berries', id: 8 },
  { value: 'Raspberry', id: 9 },
  { value: 'Strawberry', id: 10 },
  { value: 'Watermelon', id: 11 },
  { value: 'Kiwi', id: 12 },
  { value: 'Very very very very very very very long paragraph', id: 13 },
]

const useMock = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchResults = value => {
    setLoading(true)
    setTimeout(() => {
      const filterdResults = results.filter(result =>
        result.value.toLowerCase().includes(value.toLowerCase()),
      )
      setItems(filterdResults)
      setLoading(false)
    }, 500)
  }

  return [fetchResults, items, loading]
}

export const Basic = () => {
  const [selected, setSelected] = useState(null)
  const [fetchResults, items, loading] = useMock()

  return (
    <div style={containerStyle}>
      <Autocomplete
        options={items}
        loading={loading}
        onSearch={fetchResults}
        onSelect={setSelected}
      />
      <p>Selected: {JSON.stringify(selected)}</p>
    </div>
  )
}

export const ValueRender = () => {
  const [selected, setSelected] = useState(null)
  const [fetchResults, items, loading] = useMock()

  return (
    <div style={containerStyle}>
      <Autocomplete
        options={items}
        loading={loading}
        onSearch={fetchResults}
        onSelect={setSelected}
        valueRender={value => <Chip label={value} />}
      />
      <p>Selected: {JSON.stringify(selected)}</p>
    </div>
  )
}

export const Disabled = () => {
  return (
    <div style={containerStyle}>
      <Autocomplete options={[]} disabled />
    </div>
  )
}
