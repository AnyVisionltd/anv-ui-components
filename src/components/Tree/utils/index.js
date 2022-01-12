export const ALL_ROOTS_COMBINED_KEY = 'ALL_ROOTS_COMBINED_KEY'

export const TREE_NODE_PADDING = 24
export const LEAF_NODE_HEIGHT = 48
export const PARENT_NODE_WRAPPER_HEIGHT = 80
export const PARENT_NODE_HEIGHT = 72

export const DEFAULT_AMOUNT_LOADING_NODES = 6

export const SEPARATOR_SIGN = '$$'

export const emptyListTypes = Object.freeze({
  NO_ITEMS_IN_LIST: 0,
  NO_RESULTS_FOUND: 1,
})

export const getUniqueKey = (parentKey, nodeKey) => `${parentKey}${SEPARATOR_SIGN}${nodeKey}`

export const setNodesSelectedStatus = ({
  nodesTree,
  nodesMap,
  isSelected,
  childrenKey,
  isChildrenUniqueKeysOverlap
}) => {
  const keys = isChildrenUniqueKeysOverlap ? 
    { added: {}, removed: {} } : 
    { added: [], removed: [] }
  const currentUsedArrObj = isSelected ? keys.added : keys.removed

  const setAllSelected = nodes => {
    nodes.forEach(node => {
      let { uniqueKey, [childrenKey]: children } = node
      if (children) {
        setAllSelected(children)
      } else {
        const previousSelectedStatus = nodesMap[uniqueKey].isSelected
        nodesMap[uniqueKey].isSelected = isSelected
        if (isSelected !== previousSelectedStatus) {
          currentUsedArrObj.push(uniqueKey)
        }
      }
    })
  }

  setAllSelected(nodesTree)
  console.log(keys)
  return { nodesMap, keys }
}

export const setNodesExpandedStatus = ({
  nodesTree,
  isOpen,
  childrenKey,
}) =>
  nodesTree.reduce(
    (parentNodesObj, { uniqueKey, [childrenKey]: children }) => {
      if (!children) return parentNodesObj
      parentNodesObj[uniqueKey] = isOpen
      return {
        ...parentNodesObj,
        ...setNodesExpandedStatus({
          nodesTree: children,
          isOpen,
          childrenKey,
        }),
      }
    },
    {},
  )

export const checkAllNodesAreExpanded = ({
  nodesTree,
  nodesVirualizedMap,
  childrenKey,
}) => {
  if (!nodesVirualizedMap) return false
  let areExpanded = true

  const areAllNodesExpanded = nodesTreeData => {
    nodesTreeData.forEach(node => {
      console.log('mpded os ', node)
      const { uniqueKey, [childrenKey]: children } = node
      if (!children || !areExpanded) return
      if (nodesVirualizedMap[uniqueKey]?.isOpen) {
        return areAllNodesExpanded(children)
      } else {
        areExpanded = false
      }
    })
  }
  areAllNodesExpanded(nodesTree)

  return areExpanded
}

export const getNodeParents = (nodeKey, nodesMap) => {
  const parents = []
  const traverse = node => {
    if (node.parentKey !== ALL_ROOTS_COMBINED_KEY) {
      traverse(nodesMap[node.parentKey])
      parents.push(node.parentKey)
    }
  }

  traverse(nodesMap[nodeKey])
  return parents
}

export const setNodeValueInTreeFromPath = ({
  pathsArr,
  treeData,
  newProperties,
  idKey,
  childrenKey,
}) => {
  const traverseTree = (data, paths) => {
    const nodeKey = paths[0]
    return data.map(childNode => {
      if (childNode[idKey] === nodeKey) {
        if (paths.length === 1) {
          return { ...childNode, ...newProperties }
        }
        return {
          ...childNode,
          [childrenKey]: traverseTree(childNode[childrenKey], paths.slice(1)),
        }
      }
      return childNode
    })
  }
  return traverseTree(treeData, pathsArr)
}

export const convertArrayPropertiesOfObjectToSets = selectedKeysObject => (
  Object.keys(selectedKeysObject).reduce((acc, rootKey) => (
    { ...acc, [rootKey]: new Set(selectedKeysObject[rootKey]) }
  ), 
  {})
)

export const isKeyInSet = (key, set) => {
  if (set.has(key)) {
    set.delete(key)
    return true
  }
  return false
}

export const determineIsNodeSelected = ({
  selectedKeysSetOrObj,
  key,
  parentKey
}) => {
  if (selectedKeysSetOrObj instanceof Set) return isKeyInSet(key, selectedKeysSetOrObj)
  if (selectedKeysSetOrObj[parentKey] instanceof Set) return isKeyInSet(key, selectedKeysSetOrObj[parentKey])
  return false
}