import React, { useState, useMemo } from 'react'
import { action } from '@storybook/addon-actions'
import { PencilEdit, Search, ListAdd } from '@anyvision/anv-icons'
import { centerDecorator } from '../../utils/storybook/decorators'
import Tree from './Tree'

export default {
  title: 'Content/Tree',
  component: Tree,
  decorators: [centerDecorator],
}

let nodeId = 100
const createTestNode = () => {
  const node = {
    label: `test-${nodeId}`,
    key: `test-${nodeId}`,
    children: [],
  }

  for (let i = 0; i < 10; i++) {
    nodeId += 1
    const label = `test-${nodeId}`
    node.children.push({
      label,
      key: label,
    })
  }

  nodeId += 1
  return node
}

const createTestRootNodes = (amount = 25) => {
  const arr = []
  for (let i = 0; i < amount; i++) {
    arr.push(createTestNode())
  }
  return arr
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
            children: [
              {
                key: '2111',
                label: 'Berlin 1',
              },
              {
                key: '2112',
                label: 'Berlin 2',
              },
              {
                key: '2113',
                label: 'Berlin 3',
              },
            ],
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
  // treeInstance allows to access tree properties and use functions to change
  // tree properties:
  // 1. Access tree nodes' map: treeInstance.nodesMap
  // 2. Change selectedKeys in tree when they are changed from outside source, like reset to default: treeInstance.setSelectedKeys(selectedKeys)
  // 3. Change node's properties in case new data is received from sockets, etc: treeInstance.setNodeProperties(nodeKey, {...newProperties})
  const [treeInstance, setTreeInstance] = useState(null)
  const [selectedKeys, setSelectedkeys] = useState([
    'test-100',
    'test-200',
    'test-254',
  ])

  const onSelect = ({ added, removed }) => {
    // onSelect returns the status of the nodes that were either added as selected or removed.
    // So do what needs to be done when new nodes are selected / unselected, like add or remove a marker of the camera from the map.
    // And then, if needed, set the selectedKeys state :
    const newSelectedKeys = [...selectedKeys]
    newSelectedKeys.filter(key => !removed.includes(key))
    setSelectedkeys([...newSelectedKeys, ...added])
  }

  const loadMoreNodes = () =>
    new Promise(resolve => {
      setTimeout(() => {
        resolve([...createTestRootNodes(15)])
      }, 100)
    })

  const rootNodeActions = useMemo(
    () => [
      {
        label: 'Search',
        onClick: action('Search action clicked'),
        icon: <Search />,
      },
      {
        label: 'Edit',
        onClick: action('Edit action clicked'),
        icon: <PencilEdit />,
        hidden: node => node.label === 'Movies',
      },
      {
        label: 'Create',
        onClick: action('Create action clicked'),
        icon: <ListAdd />,
        hidden: node => node.children.length > 3,
      },
    ],
    [],
  )

  return (
    <Tree
      nodes={[...createTestRootNodes()]}
      selectedKeys={selectedKeys}
      onSelect={onSelect}
      rootNodeActions={rootNodeActions}
      loadMoreData={loadMoreNodes}
      maxNestingLevel={1}
      ref={setTreeInstance}
    />
  )
}

export const NestedTree = () => {
  const [selectedKeys, setSelectedkeys] = useState(['1', '2', '33', '42'])

  const onSelect = ({ added, removed }) => {
    // onSelect returns the status of the nodes that were either added as selected or removed.
    // So do what needs to be done when new nodes are selected / unselected, like add or remove a marker of the camera from the map.
    // And then, if needed, set the selectedKeys state :
    const newSelectedKeys = [...selectedKeys]
    newSelectedKeys.filter(key => !removed.includes(key))
    setSelectedkeys([...newSelectedKeys, ...added])
  }

  return (
    <Tree
      nodes={treeNodes}
      selectedKeys={selectedKeys}
      onSelect={onSelect}
      maxNestingLevel={3}
    />
  )
}

export const InfiniteTree = () => {
  const [nodes, setNodes] = useState(treeNodes)
  const [params, setParams] = useState({ limit: 50, offset: 0 })

  const loadMoreNodes = () => {
    if (params.offset > 0) return

    const newNodes = [
      {
        key: '5',
        label: 'Celebrities',
        children: [
          { label: 'Brad Pit', key: '51' },
          { label: 'Cristiano Ronaldo', key: '52' },
        ],
      },
      {
        key: '6',
        label: 'Organs',
        children: [
          { label: 'Heart', key: '61' },
          { label: 'Brain', key: '62' },
        ],
      },
    ]

    // First way
    setParams(prevParams => ({
      ...prevParams,
      offset: prevParams.offset + newNodes.length,
    }))
    setNodes(prevNodes => [...prevNodes, ...newNodes])

    // Second way
    // return newNodes
  }

  return <Tree nodes={nodes} maxNestingLevel={3} loadMoreData={loadMoreNodes} />
}
