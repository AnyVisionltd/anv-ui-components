import React, { useState } from 'react'
import Tree from './Tree'
import { centerDecorator } from '../../utils/storybook/decorators'

export default {
  title: 'User Inputs/Tree',
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
]

export const Basic = () => {
  const [selectedKeys, setSelectedkeys] = useState(['1', '211', '212'])

  return (
    <Tree
      nodes={treeNodes}
      selectedKeys={selectedKeys}
      onLeafClick={data => setSelectedkeys(data)}
      onParentClick={data => setSelectedkeys(data)}
      isSearchable
    />
  )
}
