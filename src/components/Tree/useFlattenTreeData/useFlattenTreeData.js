import { useState, useCallback, useEffect, useRef } from 'react'
import {
  addRemoveKeysInSelectedArr,
  addRemoveKeysInSelectedObj,
  ALL_ROOTS_COMBINED_KEY,
  convertArrayPropertiesOfObjectToSets,
  getTotalNodeChildren,
  handleIsNodeSelectedInNodesMap,
} from '../utils'
import useNodeSelectionWithExclusion from '../useNodeSelectionWithExclusion'

const useFlattenTreeData = ({
  data,
  selectedKeys = [],
  maxNestingLevel,
  isChildrenUniqueKeysOverlap,
  childrenKey,
  idKey,
  totalLeavesKey,
  selfControlled,
  totalRootNodes,
}) => {
  const [flattenedNodes, setFlattenedNodes] = useState({})
  const nodeKeysMap = useRef(new Map())
  const isSelectedKeysUpdatedAfterMount = useRef(false)

  const {
    handleIsNodeSelectedWithExclusion,
    handleOnSelectWithExclusion,
    handleIsAllNodesAreSelectedWithExclusion,
    calculateAmountOfSelectedNodesAndChildrenWithExclusion,
  } = useNodeSelectionWithExclusion({
    flattenedNodes,
    totalRootNodes,
    currentRootNodesAmount: data.length,
    childrenKey,
    nodeKeysMap,
    totalLeavesKey,
    maxNestingLevel,
  })

  const flatten = useCallback(
    ({ treeData, nodesMap, selectedKeysSetOrObj = new Set(), layer = 0 }) => {
      if (!Array.isArray(treeData) || treeData.length === 0) {
        return
      }

      treeData.forEach(node => {
        const { [childrenKey]: children, parentKey, uniqueKey } = node
        if (layer === 0) {
          nodesMap[ALL_ROOTS_COMBINED_KEY][childrenKey].push({ uniqueKey })
        }

        const isSelected = handleIsNodeSelectedInNodesMap({
          selectedKeysSetOrObj,
          nodeKey: node[idKey],
          parentKey,
          selfControlled,
          nodesMap,
        })

        nodesMap[uniqueKey] = {
          ...node,
          [childrenKey]: children
            ? children.map(({ uniqueKey }) => ({ uniqueKey }))
            : undefined,
          layer,
          isSelected,
        }
        flatten({
          treeData: children,
          nodesMap,
          selectedKeysSetOrObj,
          layer: layer + 1,
        })
      })
    },
    [childrenKey, idKey, selfControlled],
  )

  const calculateAmountOfSelectedNodesAndChildrenWithoutExclusion = useCallback(
    (nodeKey, isUpdate) => {
      if (!Object.keys(flattenedNodes).length) return {}
      if (!isUpdate && nodeKeysMap.current.has(nodeKey))
        return nodeKeysMap.current.get(nodeKey)
      const { isSelected, [childrenKey]: children } =
        flattenedNodes[nodeKey] || {}

      if (children) {
        const totalChildren = getTotalNodeChildren({
          flattenedNodes,
          selfControlled: true,
          childrenKey,
          maxNestingLevel,
          nodeKey,
        })
        const nodeCachedValue = {
          totalChildren,
          totalSelected: 0,
        }
        children.forEach(({ uniqueKey }) => {
          const {
            totalChildren,
            totalSelected,
          } = calculateAmountOfSelectedNodesAndChildrenWithoutExclusion(
            uniqueKey,
            isUpdate,
          )
          nodeCachedValue.totalChildren += totalChildren
          nodeCachedValue.totalSelected += totalSelected
        })
        nodeKeysMap.current.set(nodeKey, nodeCachedValue)
        return nodeCachedValue
      } else {
        return { totalChildren: 0, totalSelected: isSelected ? 1 : 0 }
      }
    },
    [childrenKey, flattenedNodes, maxNestingLevel],
  )

  const calculateAmountOfSelectedNodesAndChildren = useCallback(
    (nodeKey, isUpdate) => {
      if (selfControlled) {
        return calculateAmountOfSelectedNodesAndChildrenWithoutExclusion(
          nodeKey,
          isUpdate,
        )
      }
      return calculateAmountOfSelectedNodesAndChildrenWithExclusion(
        nodeKey,
        isUpdate,
      )
    },
    [
      calculateAmountOfSelectedNodesAndChildrenWithExclusion,
      calculateAmountOfSelectedNodesAndChildrenWithoutExclusion,
      selfControlled,
    ],
  )

  const calculateTotalSelectedAndChildrenOfAllNodes = () => {
    if (selfControlled) {
      return calculateAmountOfSelectedNodesAndChildren(ALL_ROOTS_COMBINED_KEY)
    }
    return { totalSelected: 0, totalChildren: 0 }
  }

  const updateAmountOfSelectedNodesAndChildren = useCallback(
    nodeKey => {
      calculateAmountOfSelectedNodesAndChildren(nodeKey, true)
      let { parentKey } = flattenedNodes[nodeKey]
      while (parentKey) {
        if (!selfControlled && parentKey === ALL_ROOTS_COMBINED_KEY) break
        nodeKeysMap.current.delete(parentKey)
        calculateAmountOfSelectedNodesAndChildren(parentKey)
        const { parentKey: nextParentKey } = flattenedNodes[parentKey]
        parentKey = nextParentKey
      }
    },
    [calculateAmountOfSelectedNodesAndChildren, flattenedNodes, selfControlled],
  )

  const handleAddNewFlattenedNodes = useCallback(
    ({ newNodesData, layer, selectedKeysSetOrObj, updatedParentNode }) => {
      const newFlattenedNodes = { ...flattenedNodes }
      if (!newFlattenedNodes[ALL_ROOTS_COMBINED_KEY]) {
        newFlattenedNodes[ALL_ROOTS_COMBINED_KEY] = {
          [idKey]: ALL_ROOTS_COMBINED_KEY,
          uniqueKey: ALL_ROOTS_COMBINED_KEY,
          [childrenKey]: [],
        }
      }
      if (updatedParentNode) {
        newFlattenedNodes[updatedParentNode.uniqueKey] = updatedParentNode
      }
      flatten({
        treeData: newNodesData,
        nodesMap: newFlattenedNodes,
        selectedKeysSetOrObj,
        layer,
      })
      setFlattenedNodes(newFlattenedNodes)
    },
    [childrenKey, flatten, flattenedNodes, idKey],
  )

  const handleSetSelectedNodesFromKeysArr = useCallback(
    (keysToAdd, keysToRemove = []) => {
      if (!Object.keys(flattenedNodes).length) return
      isSelectedKeysUpdatedAfterMount.current = true
      addRemoveKeysInSelectedArr({
        keysArr: keysToAdd,
        flattenedNodes,
        isSelected: true,
      })
      addRemoveKeysInSelectedArr({
        keysArr: keysToRemove,
        flattenedNodes,
        isSelected: false,
      })
      calculateAmountOfSelectedNodesAndChildren(ALL_ROOTS_COMBINED_KEY, true)
      setFlattenedNodes(prev => ({ ...prev }))
    },
    [calculateAmountOfSelectedNodesAndChildren, flattenedNodes],
  )

  const handleSetSelectedNodesFromKeysObject = useCallback(
    (keysToAdd, keysToRemove = {}) => {
      if (!Object.keys(flattenedNodes).length) return
      isSelectedKeysUpdatedAfterMount.current = true
      addRemoveKeysInSelectedObj({
        keysObject: keysToAdd,
        flattenedNodes,
        isSelected: true,
      })
      addRemoveKeysInSelectedObj({
        keysObject: keysToRemove,
        flattenedNodes,
        isSelected: false,
      })
      calculateAmountOfSelectedNodesAndChildren(ALL_ROOTS_COMBINED_KEY, true)
      setFlattenedNodes(prev => ({ ...prev }))
    },
    [calculateAmountOfSelectedNodesAndChildren, flattenedNodes],
  )

  const flattenTreeData = useCallback(
    (treeData, selectedKeysSetOrObj, layer = 0) => {
      const flattenedNodesMap = {}
      flattenedNodesMap[ALL_ROOTS_COMBINED_KEY] = {
        [idKey]: ALL_ROOTS_COMBINED_KEY,
        uniqueKey: ALL_ROOTS_COMBINED_KEY,
        [childrenKey]: [],
      }

      flatten({
        treeData,
        nodesMap: flattenedNodesMap,
        selectedKeysSetOrObj,
        layer,
      })
      setFlattenedNodes(flattenedNodesMap)
    },
    [childrenKey, flatten, idKey],
  )

  useEffect(() => {
    if (Object.keys(flattenedNodes).length || !data.length) return
    const selectedKeysParam = isChildrenUniqueKeysOverlap
      ? convertArrayPropertiesOfObjectToSets(selectedKeys)
      : new Set(selectedKeys)
    flattenTreeData(data, selectedKeysParam)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  useEffect(() => {
    if (!isSelectedKeysUpdatedAfterMount.current && selectedKeys.length) {
      if (isChildrenUniqueKeysOverlap)
        handleSetSelectedNodesFromKeysObject(selectedKeys)
      else handleSetSelectedNodesFromKeysArr(selectedKeys)
    }
  }, [
    handleSetSelectedNodesFromKeysArr,
    handleSetSelectedNodesFromKeysObject,
    isChildrenUniqueKeysOverlap,
    selectedKeys,
  ])

  return {
    flattenedNodes,
    setFlattenedNodes,
    calculateAmountOfSelectedNodesAndChildren,
    calculateTotalSelectedAndChildrenOfAllNodes,
    updateAmountOfSelectedNodesAndChildren,
    handleAddNewFlattenedNodes,
    handleSetSelectedNodesFromKeysArr,
    handleSetSelectedNodesFromKeysObject,
    isSelectedKeysUpdatedAfterMount,
    flattenTreeData,
    handleIsNodeSelectedWithExclusion,
    handleOnSelectWithExclusion,
    handleIsAllNodesAreSelectedWithExclusion,
  }
}

export default useFlattenTreeData
