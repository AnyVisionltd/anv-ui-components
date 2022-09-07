import { useRef, useState, useCallback } from 'react'
import {
  ALL_ROOTS_COMBINED_KEY,
  DEFAULT_PARENT_NODE_SELECTION_DATA,
  getNodeParents,
  getTotalLeavesSelectedOfParentNode,
  getTotalNodeChildren,
  isNodeSelectedWithExclusion,
  isParentNodeHasOnlyLeaves,
  updateNodeSelectionStatus,
} from '../utils'

const useNodeSelectionWithExclusion = ({
  flattenedNodes,
  totalRootNodes,
  currentRootNodesAmount,
  childrenKey,
  nodeKeysMap,
  totalLeavesKey,
  maxNestingLevel,
}) => {
  const [treeSelectionData, setTreeSelectionData] = useState(
    DEFAULT_PARENT_NODE_SELECTION_DATA(false),
  )
  const nodeParentKeysPathMap = useRef(new Map())

  const getCachedNodeParents = useCallback(
    nodeKey => {
      if (nodeParentKeysPathMap.current.has(nodeKey)) {
        return nodeParentKeysPathMap.current.get(nodeKey)
      }

      const parents = getNodeParents(nodeKey, flattenedNodes)
      nodeParentKeysPathMap.current.set(nodeKey, parents)
      return parents
    },
    [flattenedNodes],
  )

  const handleOnSelectAllNodesWithExclusion = useCallback(
    isSelected => {
      // State is not updated immediately when ALL_ROOTS_COMBINED is selected, so assign it before setState, so new value is used.
      treeSelectionData.excludeMode = isSelected
      treeSelectionData.items = {}
      const newSelectionData = DEFAULT_PARENT_NODE_SELECTION_DATA(isSelected)
      setTreeSelectionData(newSelectionData)
      return newSelectionData
    },
    [treeSelectionData],
  )

  const handleOnSelectWithExclusion = useCallback(
    ({ nodeKey, isSelected }) => {
      if (nodeKey === ALL_ROOTS_COMBINED_KEY) {
        return handleOnSelectAllNodesWithExclusion(isSelected)
      }
      const nodeParentsKeys = getCachedNodeParents(nodeKey)
      const newSelectionData = updateNodeSelectionStatus({
        nodeKey,
        nodeParentsKeys,
        selectionData: treeSelectionData,
        isSelected,
        nodesMap: flattenedNodes,
        childrenKey,
        maxNestingLevel,
      })
      setTreeSelectionData(newSelectionData)
      return newSelectionData
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [flattenedNodes, getCachedNodeParents, treeSelectionData],
  )

  const handleIsNodeSelectedWithExclusion = useCallback(
    nodeKey => {
      if (!flattenedNodes[nodeKey]) return false
      const nodeParentsKeys = getCachedNodeParents(nodeKey)
      return isNodeSelectedWithExclusion({
        nodeKey,
        nodeParentsKeys,
        selectionData: treeSelectionData,
        nodesMap: flattenedNodes,
        childrenKey,
        maxNestingLevel,
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [flattenedNodes, getCachedNodeParents, treeSelectionData],
  )

  const checkIfRootNodeSelected = useCallback(
    uniqueKey => {
      if (nodeKeysMap.current.has(uniqueKey)) {
        const { totalSelected, totalChildren } = nodeKeysMap.current.get(
          uniqueKey,
        )
        return totalSelected === totalChildren
      }
      return handleIsNodeSelectedWithExclusion(uniqueKey)
    },
    [handleIsNodeSelectedWithExclusion, nodeKeysMap],
  )

  const handleIsAllNodesAreSelectedWithExclusion = useCallback(() => {
    if (!Object.keys(treeSelectionData.items).length) {
      return treeSelectionData.excludeMode
    }
    if (totalRootNodes !== currentRootNodesAmount) return false
    const allRootsCombinedNode = flattenedNodes[ALL_ROOTS_COMBINED_KEY]
    if (!allRootsCombinedNode) return false
    const { [childrenKey]: children } = allRootsCombinedNode
    return children.every(({ uniqueKey }) => checkIfRootNodeSelected(uniqueKey))
  }, [
    treeSelectionData,
    totalRootNodes,
    currentRootNodesAmount,
    flattenedNodes,
    childrenKey,
    checkIfRootNodeSelected,
  ])

  const handleTotalSelectedOfParentNodeWithExclusion = useCallback(
    (nodeKey, totalLeaves, nodeNestingLevel) => {
      if (nodeKey === ALL_ROOTS_COMBINED_KEY) return 0
      const nodeParentsKeys = getCachedNodeParents(nodeKey)
      return getTotalLeavesSelectedOfParentNode({
        nodePaths: [...nodeParentsKeys, nodeKey],
        selectionData: treeSelectionData,
        totalLeaves,
        maxNestingLevel,
        nodeNestingLevel,
      })
    },
    [getCachedNodeParents, treeSelectionData, maxNestingLevel],
  )

  const calculateAmountOfSelectedNodesAndChildrenWithExclusion = (
    nodeKey,
    isUpdate,
  ) => {
    if (!Object.keys(flattenedNodes).length) return {}
    if (!isUpdate && nodeKeysMap.current.has(nodeKey))
      return nodeKeysMap.current.get(nodeKey)
    const { [childrenKey]: children, layer } = flattenedNodes[nodeKey] || {}

    if (!children) return { totalSelected: 0, totalChildren: 0 }

    const totalChildren = getTotalNodeChildren({
      flattenedNodes,
      selfControlled: false,
      totalLeavesKey,
      childrenKey,
      maxNestingLevel,
      nodeKey,
    })
    const nodeCachedValue = {
      totalChildren,
      totalSelected: handleTotalSelectedOfParentNodeWithExclusion(
        nodeKey,
        totalChildren,
        layer,
      ),
    }

    if (isParentNodeHasOnlyLeaves(layer, maxNestingLevel)) {
      nodeKeysMap.current.set(nodeKey, nodeCachedValue)
      return nodeCachedValue
    }

    children.forEach(({ uniqueKey }) => {
      if (!flattenedNodes[uniqueKey]?.isParentNode) return
      const {
        totalChildren,
        totalSelected,
      } = calculateAmountOfSelectedNodesAndChildrenWithExclusion(
        uniqueKey,
        isUpdate,
      )
      nodeCachedValue.totalChildren += totalChildren
      nodeCachedValue.totalSelected += totalSelected
    })
    nodeKeysMap.current.set(nodeKey, nodeCachedValue)
    return nodeCachedValue
  }

  return {
    handleIsNodeSelectedWithExclusion,
    handleOnSelectWithExclusion,
    handleIsAllNodesAreSelectedWithExclusion,
    calculateAmountOfSelectedNodesAndChildrenWithExclusion,
  }
}

export default useNodeSelectionWithExclusion
