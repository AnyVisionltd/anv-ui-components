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
  // const parentChildrenOfNodeMap = useRef(new Map())

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

  const handleOnSelectWithExclusion = useCallback(
    ({ nodeKey, isSelected }) => {
      if (nodeKey === ALL_ROOTS_COMBINED_KEY) {
        // State is not updated immediately when ALL_ROOTS_COMBINED is selected, so assign it before setState, so new value is used.
        treeSelectionData.excludeMode = isSelected
        treeSelectionData.items = {}
        setTreeSelectionData(DEFAULT_PARENT_NODE_SELECTION_DATA(isSelected))
        return
      }
      const nodeParentsKeys = getCachedNodeParents(nodeKey)
      const newSelectionData = updateNodeSelectionStatus({
        nodeKey,
        nodeParentsKeys,
        selectionData: treeSelectionData,
        isSelected,
        nodesMap: flattenedNodes,
      })
      setTreeSelectionData(newSelectionData)
    },
    [flattenedNodes, getCachedNodeParents, treeSelectionData],
  )

  const handleIsNodeSelectedWithExclusion = useCallback(
    nodeKey => {
      const nodeParentsKeys = getCachedNodeParents(nodeKey)
      return isNodeSelectedWithExclusion({
        nodeKey,
        nodeParentsKeys,
        selectionData: treeSelectionData,
        nodesMap: flattenedNodes,
      })
    },
    [flattenedNodes, getCachedNodeParents, treeSelectionData],
  )

  const handleIsAllNodesAreSelectedWithExclusion = useCallback(() => {
    if (!Object.keys(treeSelectionData.items).length) {
      return treeSelectionData.excludeMode
    }
    if (totalRootNodes !== currentRootNodesAmount) return false
    const allRootsCombinedNode = flattenedNodes[ALL_ROOTS_COMBINED_KEY]
    if (!allRootsCombinedNode) return false
    const { [childrenKey]: children } = allRootsCombinedNode
    return children.every(({ uniqueKey }) =>
      handleIsNodeSelectedWithExclusion(uniqueKey),
    )
  }, [
    treeSelectionData,
    totalRootNodes,
    currentRootNodesAmount,
    flattenedNodes,
    handleIsNodeSelectedWithExclusion,
    childrenKey,
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
      // Run the selection, take into account the nodes dataSelection
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
      // Here I want to run only the parent in !selfControlled mode
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
