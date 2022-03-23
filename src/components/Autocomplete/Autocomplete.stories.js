import React, { useState } from 'react'
import { centerDecorator } from '../../utils/storybook/decorators'
import Autocomplete from './Autocomplete'

export default {
  title: 'Content/Autocomplete',
  component: Autocomplete,
  decorators: [centerDecorator],
}

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  marginBottom: '300px',
}

const results = [
  { value: 'VERY LONG TEXT TO SEE TOOLTIP - VERY LONGgfdgfdg  ', id: 1222 },
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
  { value: 'Kiwi2', id: 12 },
  { value: 'Kiwi3', id: 1210 },
  { value: 'Kiwi4', id: 129 },
  { value: 'Kiwi5', id: 128 },
  { value: 'Kiwi6', id: 127 },
  { value: 'Kiwi7', id: 126 },
  { value: 'Kiwi9', id: 125 },
  { value: 'Kiwi10', id: 124 },
  { value: 'Kiwi11', id: 123 },
  { value: 'Kiwi12', id: 122 },
  { value: 'Kiwi13', id: 121 },
]

export const Basic = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchResults = value => {
    setLoading(true)
    setTimeout(() => {
      const filterdResults = results.filter(result =>
        result.value.toLowerCase().includes(value.toLowerCase()),
      )
      console.log('filterdResults', filterdResults)
      setItems(filterdResults)
      setLoading(false)
    }, 500)
  }

  const handleSearchChange = value => {
    console.log('value', value)
    fetchResults(value)
  }

  return (
    <div style={containerStyle}>
      <Autocomplete
        options={items}
        onSearchChange={handleSearchChange}
        loading={loading}
        onChange={console.log}
      />
    </div>
  )
}
