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
  { id: 'item 1', value: 'item 1' },
  { id: 'item 2', value: 'item 2' },
  { id: 'item 3', value: 'item 3' },
  { id: 'item 4', value: 'item 4' },
  { id: 'item 6', value: 'item 5' },
  { id: 'item 7', value: 'item 6' },
  { id: 'item 8', value: 'item 7' },
  { id: 'item 9', value: 'item 8' },
  { id: 'item 10', value: 'item 9' },
  { id: 'item 11', value: 'item 10' },
  { id: 'item 12', value: 'item 11' },
  { id: 'item 13', value: 'item 12' },
  { id: 'item 14', value: 'item 13' },
  { id: 'item 15', value: 'item 14' },
  { id: 'item 16', value: 'item 15' },
  { id: 'item 17', value: 'item 16' },
  { id: 'item 18', value: 'item 17' },
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
    <div className={styles.marginFlexContainer}>
      <MenuSelect
        menuContainerId='Default'
        preferOpenDirection='bottom-start'
        items={defaultItems}
        selectedData={selectedItem.value}
      />
    </div>
  )
}

export const SelectMultiple = () => {
  const [selectedItems, setSelectedItems] = useState([])

  const handleRemoveAllSelectedItems = () => {
    setSelectedItems([])
  }

  const defaultItems = items.map(item => ({
    callback: () =>
      setSelectedItems(prev => {
        if (prev.find(id => item.id === id)) {
          return prev.filter(id => item.id !== id)
        }
        return [...prev, item.id]
      }),
    element: item.value,
    isSelected: !!selectedItems.find(id => item.id === id),
    key: item.id,
  }))

  return (
    <div className={styles.marginFlexContainer}>
      <MenuSelect
        menuContainerId='Default'
        preferOpenDirection='bottom-start'
        items={defaultItems}
        selectedData={selectedItems}
        isMultiSelect={true}
        removeAll={handleRemoveAllSelectedItems}
      />
    </div>
  )
}
