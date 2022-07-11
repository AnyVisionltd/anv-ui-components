import React, { useState } from 'react'
import MenuSelect from './MenuSelect'
import styles from '../../storybook/index.module.scss'
import { centerDecorator } from '../../utils/storybook/decorators'

export default {
  title: 'User Inputs/MenuSelect',
  component: MenuSelect,
  decorators: [centerDecorator],
}

const items = [
  { id: 'testItem 1', value: 'testItem 1' },
  { id: 'testItem 2', value: 'testItem 2' },
  { id: 'testItem 3', value: 'testItem 3' },
  { id: 'testItem 4', value: 'testItem 4' },
  { id: 'testItem 6', value: 'testItem 5' },
  { id: 'testItem 7', value: 'testItem 6' },
  { id: 'testItem 8', value: 'testItem 7' },
  { id: 'testItem 9', value: 'testItem 8' },
  { id: 'testItem 10', value: 'testItem 9' },
  { id: 'testItem 11', value: 'testItem 10' },
  { id: 'testItem 12', value: 'testItem 11' },
  { id: 'testItem 13', value: 'testItem 12' },
  { id: 'testItem 14', value: 'testItem 13' },
  { id: 'testItem 15', value: 'testItem 14' },
  { id: 'testItem 16', value: 'testItem 15' },
  { id: 'testItem 17', value: 'testItem 16' },
  { id: 'testItem 18', value: 'testItem 17' },
]

export const Default = () => {
  const [selectedItem, setSelectedItem] = useState(items[0])

  const defaultItems = items.map(item => ({
    callback: () => setSelectedItem(item),
    element: item.value,
    isSelected: selectedItem.id === item.id,
    key: item.id,
  }))

  return (
    <MenuSelect
      menuContainerId='Default'
      preferOpenDirection='bottom-start'
      items={defaultItems}
      selectedItemValue={selectedItem.value}
    />
  )
}
