import React, { useState } from 'react'
import Tree from './Tree'
import { centerDecorator } from '../../utils/storybook/decorators'

export default {
  title: 'Content/Tree',
  component: Tree,
  decorators: [centerDecorator],
}

const treeNodes = [
  {
    key: '1',
    label: 'Cities',
    children: [
      {
        label: 'Jerusalem',
        key: '11',
      },
      {
        label: 'Eilat',
        key: '12',
      },
      {
        label: 'Tel Aviv',
        key: '13',
      },
      {
        label: 'Holon',
        key: '14',
      },
    ],
  },
  {
    key: '2',
    label: 'Countries',
    children: [
      {
        label: 'Germany',
        key: '21',
        children: [
          {
            key: '211',
            label: 'Berlin',
          },
          {
            key: '212',
            label: 'Dortmund',
          },
        ],
      },
      {
        label: 'Italy',
        key: '22',
        children: [
          {
            key: '221',
            label: 'Milano',
          },
          {
            key: '222',
            label: 'Napoli',
          },
          {
            key: '223',
            label: 'Rome',
          },
        ],
      },
      {
        label: 'England',
        key: '23',
        children: [
          {
            key: '231',
            label: 'Manchseter',
          },
          {
            key: '232',
            label: 'London',
          },
          {
            key: '233',
            label: 'Norwich',
          },
          {
            key: '234',
            label: 'Westham',
          },
        ],
      },
    ],
  },
  {
    key: '3',
    label: 'Seas and Oceans',
    children: [
      {
        label: 'Pacific Ocean',
        key: '31',
      },
      {
        label: 'Atlantic Ocean',
        key: '32',
      },
      {
        label: 'Kinneret',
        key: '33',
      },
      {
        label: 'Dead Sea',
        key: '34',
      },
    ],
  },
  {
    key: '4',
    label: 'Movies',
    children: [
      {
        label: 'Fast and Furious',
        key: '41',
        children: [
          {
            key: '411',
            label: 'Fast and Furious 1',
          },
          {
            key: '412',
            label: 'Fast and Furious 2',
          },
          {
            key: '413',
            label: 'Fast and Furious 3',
          },
          {
            key: '414',
            label: 'Fast and Furious 4',
          },
        ],
      },
      {
        label: 'Avatar',
        key: '42',
      },
      {
        label: 'Titanic',
        key: '43',
      },
      {
        label: 'Superman',
        key: '44',
      },
      {
        label: 'Spiderman',
        key: '45',
      },
      {
        label: 'Avengers',
        key: '46',
      },
      {
        label: 'James Bond',
        key: '47',
      },
      {
        label: 'Shrek',
        key: '48',
      },
    ],
  },
]

export const Basic = () => {
  const [selectedKeys, setSelectedkeys] = useState(['1', '211', '212'])

  const onSelect = ({ added, removed }) => {
    // Do what needs to be done when new nodes are selected / unselected
    // And then if needed:
    const newSelectedKeys = [...selectedKeys]
    newSelectedKeys.filter(key => !removed.includes(key))
    setSelectedkeys([...newSelectedKeys, ...added])
  }

  return (
    <Tree
      nodes={treeNodes}
      selectedKeys={selectedKeys}
      onSelect={onSelect}
      isSearchable
    />
  )
}
