import React from 'react'
import List from './List'
import { Checkbox, Button } from '../../index'
import { centerDecorator } from '../../utils/storybook/decorators'

export default {
  title: 'Content/Lists/List',
  component: List,
  decorators: [centerDecorator],
  subcomponents: { Item: List.Item },
}

const list = [
  'Item 1',
  'Item 2',
  'Item 3',
  'Item 4',
  'Item 5',
  'Item 6',
  'Item 7',
]

export const Basic = () => {
  return (
    <List style={{ width: '400px' }}>
      <List.Item>Item 1</List.Item>
      <List.Item>Item 2</List.Item>
      <List.Item>Item 3</List.Item>
      <List.Item>Item 4</List.Item>
    </List>
  )
}

export const WithLeading = () => {
  return (
    <List style={{ width: '400px' }}>
      {list.map((item, index) => (
        <List.Item key={index} leadingComponent={<Checkbox />}>
          {item}
        </List.Item>
      ))}
    </List>
  )
}

export const WithTrailing = () => {
  return (
    <List style={{ width: '400px' }}>
      {list.map((item, index) => (
        <List.Item
          key={index}
          trailingComponent={<Button size={'small'}>Edit</Button>}
        >
          {item}
        </List.Item>
      ))}
    </List>
  )
}
