export const ALL_ROOTS_COMBINED_KEY = 'ALL_ROOTS_COMBINED_KEY'

export const PLACEHOLDER_NODE_ID = 'placeholder-node'
export const PAGINATION_NODE_ID = parentNodeKey => `pagination-${parentNodeKey}`

export const TREE_NODE_PADDING = 24
export const LEAF_NODE_HEIGHT = 48
export const PARENT_NODE_WRAPPER_HEIGHT = 80
export const PARENT_NODE_HEIGHT = 72
export const PAGINATION_NODE_HEIGHT = 48

export const DEFAULT_PARENT_NODE_SELECTION_DATA = (excludeMode = false) => ({
  items: {},
  excludeMode,
})

export const DEFAULT_AMOUNT_LOADING_NODES = 6

export const SEPARATOR_SIGN = '$$'

export const emptyListTypes = Object.freeze({
  NO_ITEMS_IN_LIST: 0,
  NO_RESULTS_FOUND: 1,
})

export const nodesListTypes = Object.freeze({
  PAGINATION: 'pagination',
  PLACEHOLDER: 'placeholder',
})

export const isPaginationNode = ({ type }) => type === nodesListTypes.PAGINATION
export const isPlaceholderNode = ({ type }) =>
  type === nodesListTypes.PLACEHOLDER

export const refreshTree = treeInstance => {
  if (!treeInstance) return
  const { props, state } = treeInstance
  state.computeTree(
    props,
    { ...state, records: undefined, order: undefined },
    { refresh: true },
  )
  state.resetAfterId(PLACEHOLDER_NODE_ID)
}

export const mergeChildrenOfNode = childrenKey => (node, newProperties) => {
  const {
    [childrenKey]: newAddedChildren,
    ...restNodeProperties
  } = newProperties
  return {
    ...node,
    ...restNodeProperties,
    [childrenKey]: [...node[childrenKey], ...newAddedChildren],
  }
}

export const getUniqueKey = (parentKey, nodeKey) =>
  `${parentKey}${SEPARATOR_SIGN}${nodeKey}`

export const setNodesSelectedStatus = ({
  nodesTree,
  nodesMap,
  isSelected,
  childrenKey,
  idKey,
  isChildrenUniqueKeysOverlap,
  isReturnWholeNodeDataWhenOnSelect,
}) => {
  const keys = isChildrenUniqueKeysOverlap
    ? { added: {}, removed: {} }
    : { added: [], removed: [] }
  const currentUsedArrObj = isSelected ? keys.added : keys.removed

  const setAllSelected = nodes => {
    nodes.forEach(node => {
      let { uniqueKey, [childrenKey]: children, [idKey]: key, parentKey } = node
      if (children) {
        setAllSelected(children)
      } else {
        const previousSelectedStatus = nodesMap[uniqueKey].isSelected
        nodesMap[uniqueKey].isSelected = isSelected
        if (isSelected !== previousSelectedStatus) {
          if (isChildrenUniqueKeysOverlap) {
            currentUsedArrObj[parentKey] = currentUsedArrObj[parentKey] || []
            currentUsedArrObj[parentKey].push(
              isReturnWholeNodeDataWhenOnSelect ? node : key,
            )
          } else {
            currentUsedArrObj.push(
              isReturnWholeNodeDataWhenOnSelect ? node : key,
            )
          }
        }
      }
    })
  }

  setAllSelected(nodesTree)
  return { nodesMap, keys }
}

export const setNodesExpandedStatus = ({ nodesTree, isOpen, childrenKey }) =>
  nodesTree.reduce((parentNodesObj, { uniqueKey, [childrenKey]: children }) => {
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
  }, {})

export const checkAllNodesAreExpanded = ({
  nodesTree,
  nodesVirtualizedMap,
  childrenKey,
}) => {
  if (!nodesVirtualizedMap) return false
  let areExpanded = true

  const areAllNodesExpanded = nodesTreeData => {
    nodesTreeData.forEach(node => {
      const { uniqueKey, [childrenKey]: children } = node
      if (!children || !areExpanded) return
      if (nodesVirtualizedMap?.get(uniqueKey)?.public.isOpen) {
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
  childrenKey,
  nodeSetterFunction = (node, newProperties) => ({ ...node, ...newProperties }),
}) => {
  const traverseTree = (data, paths) => {
    const nodeKey = paths[0]
    return data.map(childNode => {
      if (childNode.uniqueKey === nodeKey) {
        if (paths.length === 1) {
          return nodeSetterFunction(childNode, newProperties)
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

export const convertArrayPropertiesOfObjectToSets = selectedKeysObject =>
  Object.keys(selectedKeysObject).reduce(
    (acc, rootKey) => ({
      ...acc,
      [rootKey]: new Set(selectedKeysObject[rootKey]),
    }),
    {},
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
  parentKey,
}) => {
  if (selectedKeysSetOrObj instanceof Set)
    return isKeyInSet(key, selectedKeysSetOrObj)
  if (selectedKeysSetOrObj[parentKey] instanceof Set)
    return isKeyInSet(key, selectedKeysSetOrObj[parentKey])
  return false
}

export const handleIsNodeSelectedInNodesMap = ({
  selectedKeysSetOrObj,
  parentKey,
  selfControlled,
  nodesMap,
  nodeKey,
}) => {
  if (!selfControlled) return
  const isParentSelected = nodesMap[parentKey]?.isSelected
  return (
    isParentSelected ||
    determineIsNodeSelected({
      selectedKeysSetOrObj,
      key: nodeKey,
      parentKey,
    })
  )
}

const handleUniqueKeysOnSelect = (selectedKeys, { removed, added }) => {
  const newSelectedKeys = [...selectedKeys]
  const removedKeysSet = new Set(removed)
  newSelectedKeys.filter(key => !removedKeysSet.has(key))
  return [...newSelectedKeys, ...added]
}

const handleOverlappingKeysOnSelect = (selectedKeys, { removed, added }) => {
  const newSelectedKeys = { ...selectedKeys }
  const removedKeysObjectWithSets = convertArrayPropertiesOfObjectToSets(
    removed,
  )
  Object.entries(removedKeysObjectWithSets).forEach(
    ([parentKey, newRemovedKeys]) => {
      newSelectedKeys[parentKey] = newSelectedKeys[parentKey].filter(
        key => !newRemovedKeys.has(key),
      )
    },
  )
  Object.entries(added).forEach(([parentKey, newAddedKeys]) => {
    newSelectedKeys[parentKey] = [
      ...newSelectedKeys[parentKey],
      ...newAddedKeys,
    ]
  })
  return newSelectedKeys
}

export const organizeSelectedKeys = ({
  isChildrenUniqueKeysOverlap,
  keysToToggle,
  selectedKeys,
}) => {
  if (!isChildrenUniqueKeysOverlap)
    return handleUniqueKeysOnSelect(selectedKeys, keysToToggle)
  return handleOverlappingKeysOnSelect(selectedKeys, keysToToggle)
}

export const addRemoveKeysInSelectedArr = ({
  keysArr,
  flattenedNodes,
  isSelected,
}) => {
  keysArr.forEach(key => {
    if (flattenedNodes[key]) {
      flattenedNodes[key] = { ...flattenedNodes[key], isSelected }
    }
  })
}

export const addRemoveKeysInSelectedObj = ({
  keysObject,
  flattenedNodes,
  isSelected,
}) => {
  Object.entries(keysObject).forEach(([rootNodeKey, keys]) => {
    keys.forEach(key => {
      const uniqueKey = `${rootNodeKey}${SEPARATOR_SIGN}${key}`
      if (flattenedNodes[uniqueKey]) {
        flattenedNodes[uniqueKey] = { ...flattenedNodes[uniqueKey], isSelected }
      }
    })
  })
}

export const isParentNodeHasOnlyLeaves = (nodeNestingLevel, maxNestingLevel) =>
  maxNestingLevel - nodeNestingLevel === 1

export const getTotalDirectNodeChildren = ({
  nodeKey,
  flattenedNodes,
  totalChildrenKey,
  childrenKey,
}) => {
  const { [childrenKey]: children, [totalChildrenKey]: totalDirectChildren } =
    flattenedNodes[nodeKey] || {}
  return Number.isInteger(totalDirectChildren)
    ? totalDirectChildren
    : children.length
}

export const getTotalDirectNodeLeaves = ({
  selfControlled,
  nodeKey,
  flattenedNodes,
  totalLeavesKey,
  childrenKey,
  maxNestingLevel,
}) => {
  const { [childrenKey]: children, layer, [totalLeavesKey]: totalLeaves } =
    flattenedNodes[nodeKey] || {}
  if (!selfControlled && Number.isInteger(totalLeaves)) return totalLeaves

  // It means that the current parentNode has only leaves so no need to filter
  if (isParentNodeHasOnlyLeaves(layer, maxNestingLevel)) return children.length
  return children.filter(
    ({ uniqueKey }) => !flattenedNodes[uniqueKey]?.isParentNode,
  ).length
}

const isParentNodeSelectedWithExclusion = ({
  nodeKey,
  selectionData,
  nodesMap,
  childrenKey,
  maxNestingLevel,
}) => {
  const { excludeMode, items } = selectionData
  const itemsLength = Object.keys(items).length
  if (!itemsLength) return excludeMode

  const { layer, [childrenKey]: children } = nodesMap[nodeKey]

  if (isParentNodeHasOnlyLeaves(layer, maxNestingLevel)) {
    return excludeMode ? !itemsLength : itemsLength === children.length
  }

  return children.every(({ uniqueKey }) =>
    isNodeSelectedWithExclusion({
      nodeKey: uniqueKey,
      selectionData,
      nodesMap,
      childrenKey,
      nodeParentsKeys: [],
      maxNestingLevel,
    }),
  )
}

const isLeafNodeSelectedWithExclusion = ({ nodeKey, parentSelectionData }) => {
  const { items, excludeMode } = parentSelectionData
  if (excludeMode) {
    return !items[nodeKey]
  }
  return !!items[nodeKey]
}

export const isNodeSelectedWithExclusion = ({
  nodeKey,
  nodeParentsKeys,
  selectionData,
  nodesMap,
  childrenKey,
  maxNestingLevel,
}) => {
  const { items, excludeMode } = selectionData
  const itemsLength = Object.keys(selectionData.items).length
  if (excludeMode && !itemsLength) {
    return true
  }

  if (!nodeParentsKeys.length) {
    const isParentNode = !!nodesMap[nodeKey]?.isParentNode
    if (!isParentNode) {
      return isLeafNodeSelectedWithExclusion({
        nodeKey,
        parentSelectionData: selectionData,
      })
    }

    if (!items[nodeKey]) {
      return excludeMode
    }
    return isParentNodeSelectedWithExclusion({
      nodeKey,
      selectionData: items[nodeKey],
      nodesMap,
      childrenKey,
      maxNestingLevel,
    })
  }

  const [nodeParentKey] = nodeParentsKeys
  if (!items[nodeParentKey]) {
    return excludeMode
  }
  return isNodeSelectedWithExclusion({
    nodeKey,
    nodeParentsKeys: nodeParentsKeys.slice(1),
    selectionData: items[nodeParentKey],
    nodesMap,
    childrenKey,
    maxNestingLevel,
  })
}

export const updateNodeSelectionStatus = ({
  nodeKey,
  nodeParentsKeys,
  selectionData,
  isSelected,
  nodesMap,
  childrenKey,
  maxNestingLevel,
}) => {
  const newSelectionData = { ...selectionData }

  const updateSelectionData = ({ parentsKeys, selection }) => {
    if (!parentsKeys.length) {
      const isParentNode = !!nodesMap[nodeKey]?.isParentNode
      if (isParentNode) {
        selection.items[nodeKey] = DEFAULT_PARENT_NODE_SELECTION_DATA(
          isSelected,
        )
        return
      }
      const shouldAddNodeToItemsSelection =
        (!selection.excludeMode && isSelected) ||
        (selection.excludeMode && !isSelected)
      if (shouldAddNodeToItemsSelection) {
        selection.items[nodeKey] = true
      } else {
        delete selection.items[nodeKey]
      }
      return
    }
    const [nodeParentKey] = parentsKeys
    if (!selection.items[nodeParentKey]) {
      const isParentNodeSelected = isParentNodeSelectedWithExclusion({
        nodeKey: nodeParentKey,
        selectionData: selection,
        nodesMap,
        childrenKey,
        maxNestingLevel,
      })
      selection.items[nodeParentKey] = DEFAULT_PARENT_NODE_SELECTION_DATA(
        isParentNodeSelected,
      )
    }
    updateSelectionData({
      parentsKeys: parentsKeys.slice(1),
      selection: selection.items[nodeParentKey],
    })
  }
  updateSelectionData({
    parentsKeys: nodeParentsKeys,
    selection: newSelectionData,
  })
  return newSelectionData
}

export const getSelectedLeavesAmountOutOfItems = ({
  maxNestingLevel,
  nodeNestingLevel,
  itemsObj,
}) => {
  if (isParentNodeHasOnlyLeaves(nodeNestingLevel, maxNestingLevel)) {
    return Object.keys(itemsObj).length
  }
  return Object.values(itemsObj).filter(value => value === true).length
}

export const getSelectedParentsAmountOutOfItems = ({
  maxNestingLevel,
  nodesMap,
  childrenKey,
  parentSelectionData,
}) => {
  const { items, excludeMode } = parentSelectionData
  return Object.entries(items).reduce((acc, [nodeKey, selectionValue]) => {
    if (typeof selectionValue !== 'object') return acc
    const isNodeSelected = isParentNodeSelectedWithExclusion({
      nodeKey,
      selectionData: items[nodeKey],
      nodesMap,
      childrenKey,
      nodeParentsKeys: [],
      maxNestingLevel,
    })
    const isNodeSelectionSameAsParentExcludeMode =
      (excludeMode && isNodeSelected) || (!excludeMode && !isNodeSelected)
    if (isNodeSelectionSameAsParentExcludeMode) return acc
    return acc + 1
  }, 0)
}

export const getTotalLeavesSelectedOfParentNode = ({
  nodePaths,
  selectionData,
  totalLeaves,
  maxNestingLevel,
  nodeNestingLevel,
}) => {
  const { items, excludeMode } = selectionData

  if (!nodePaths.length) {
    const leavesAmount = getSelectedLeavesAmountOutOfItems({
      maxNestingLevel,
      nodeNestingLevel,
      itemsObj: items,
    })
    return excludeMode ? totalLeaves - leavesAmount : leavesAmount
  }

  const [nodeKey] = nodePaths
  if (!items[nodeKey]) {
    return excludeMode ? totalLeaves : 0
  }

  return getTotalLeavesSelectedOfParentNode({
    nodePaths: nodePaths.slice(1),
    selectionData: items[nodeKey],
    totalLeaves,
    maxNestingLevel,
    nodeNestingLevel,
  })
}

export const getTotalDirectChildrenSelectedOfParentNode = ({
  nodePaths,
  selectionData,
  totalChildren,
  maxNestingLevel,
  nodeNestingLevel,
  nodesMap,
  childrenKey,
}) => {
  const { items, excludeMode } = selectionData

  if (!nodePaths.length) {
    const selectedLeavesAmount = getSelectedLeavesAmountOutOfItems({
      maxNestingLevel,
      nodeNestingLevel,
      itemsObj: items,
    })
    const selectedParentsAmount = getSelectedParentsAmountOutOfItems({
      maxNestingLevel,
      nodesMap,
      childrenKey,
      parentSelectionData: selectionData,
    })
    if (excludeMode) {
      return totalChildren - selectedLeavesAmount - selectedParentsAmount
    }
    return selectedLeavesAmount + selectedParentsAmount
  }

  const [nodeKey] = nodePaths
  if (!items[nodeKey]) {
    return excludeMode ? totalChildren : 0
  }

  return getTotalDirectChildrenSelectedOfParentNode({
    nodePaths: nodePaths.slice(1),
    selectionData: items[nodeKey],
    totalChildren,
    maxNestingLevel,
    nodeNestingLevel,
    nodesMap,
    childrenKey,
  })
}

export const getParentNodeExclusionMode = ({ nodePaths, selectionData }) => {
  const { items, excludeMode } = selectionData

  if (!nodePaths.length) {
    return excludeMode
  }

  const [nodeKey] = nodePaths
  if (!items[nodeKey]) {
    return excludeMode
  }

  return getParentNodeExclusionMode({
    nodePaths: nodePaths.slice(1),
    selectionData: items[nodeKey],
  })
}

function findNodeById(data, id) {
  let foundNode

  function run(node) {
    if (node.id.toLowerCase() === id.toLowerCase()) {
      foundNode = node
    } else {
      const { children = [] } = node
      children.forEach(run)
    }
  }

  data.forEach(run)

  return foundNode
}

function findByIdAndRemove(data, id) {
  let itemToMove
  function run(node, index, arr) {
    if (node.id.toLowerCase() === id.toLowerCase()) {
      ;[itemToMove] = arr.splice(index, 1)
    } else {
      const { children = [] } = node
      children.forEach(run)
    }
  }

  data.forEach(run)

  return itemToMove
}

export function getDataAfterReGroup(data, sourceId, targetId) {
  const itemToMove = findByIdAndRemove(data, sourceId)
  const target = findNodeById(data, targetId)
  target.children = [...target?.children, itemToMove]
  return data
}
