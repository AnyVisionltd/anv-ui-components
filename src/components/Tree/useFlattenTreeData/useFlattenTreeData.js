import { useState, useCallback, useEffect, useRef } from 'react'
import {
  addRemoveKeysInSelectedArr,
  addRemoveKeysInSelectedObj,
  ALL_ROOTS_COMBINED_KEY,
  convertArrayPropertiesOfObjectToSets,
  determineIsNodeSelected,
} from '../utils'

const useFlattenTreeData = ({
  data,
  selectedKeys = [],
  maxNestingLevel,
  isChildrenUniqueKeysOverlap,
  childrenKey,
  labelKey,
  idKey,
}) => {
  const [flattenedNodes, setFlattenedNodes] = useState({})
  const nodeKeysMap = useRef(new Map())
  const isSelectedKeysUpdatedAfterMount = useRef(false)

  const flatten = useCallback(
    (treeData, nodesMap, selectedKeysSetOrObj = new Set(), layer = 0) => {
      if (!Array.isArray(treeData) || treeData.length === 0) {
        return
      }

      treeData.forEach(node => {
        let { [childrenKey]: children, parentKey, uniqueKey } = node

        if (layer === 0) {
          nodesMap[ALL_ROOTS_COMBINED_KEY][childrenKey].push({ uniqueKey })
        }

        const isParentSelected = nodesMap[parentKey]?.isSelected

        nodesMap[uniqueKey] = {
          ...node,
          [childrenKey]: children
            ? children.map(({ uniqueKey }) => ({ uniqueKey }))
            : undefined,
          layer,
          isSelected:
            isParentSelected ||
            determineIsNodeSelected({
              selectedKeysSetOrObj,
              key: node[idKey],
              parentKey,
            }),
        }
        flatten(children, nodesMap, selectedKeysSetOrObj, layer + 1)
      })
    },
    [childrenKey, idKey],
  )

  const getTotalNodeChildren = useCallback(
    (children, nodeNesingLevel) => {
      // It means that the current parentNode has only leaves so no need to filter
      if (maxNestingLevel - nodeNesingLevel === 1) return children.length
      return children.filter(
        ({ uniqueKey }) => !flattenedNodes[uniqueKey]?.isParentNode,
      ).length
    },
    [flattenedNodes, maxNestingLevel],
  )

  const calculateAmountOfSelectedNodesAndChildren = useCallback(
    (nodeKey, isUpdate) => {
      if (!Object.keys(flattenedNodes).length) return {}
      if (!isUpdate && nodeKeysMap.current.has(nodeKey))
        return nodeKeysMap.current.get(nodeKey)
      const { isSelected, [childrenKey]: children, layer } =
        flattenedNodes[nodeKey] || {}
      if (children) {
        const nodeCachedValue = {
          totalChildren: getTotalNodeChildren(children, layer),
          totalSelected: 0,
        }
        children.forEach(({ uniqueKey }) => {
          const {
            totalChildren,
            totalSelected,
          } = calculateAmountOfSelectedNodesAndChildren(uniqueKey, isUpdate)
          nodeCachedValue.totalChildren += totalChildren
          nodeCachedValue.totalSelected += totalSelected
        })
        nodeKeysMap.current.set(nodeKey, nodeCachedValue)
        return nodeCachedValue
      } else {
        return { totalChildren: 0, totalSelected: isSelected ? 1 : 0 }
      }
    },
    [childrenKey, flattenedNodes, getTotalNodeChildren],
  )

  const updateAmountOfSelectedNodesAndChildren = useCallback(
    nodeKey => {
      calculateAmountOfSelectedNodesAndChildren(nodeKey, true)
      let { parentKey } = flattenedNodes[nodeKey]
      while (parentKey) {
        nodeKeysMap.current.delete(parentKey)
        calculateAmountOfSelectedNodesAndChildren(parentKey)
        const { parentKey: nextParentKey } = flattenedNodes[parentKey]
        parentKey = nextParentKey
      }
    },
    [calculateAmountOfSelectedNodesAndChildren, flattenedNodes],
  )

  const handleAddNewFlattenedNodes = useCallback(
    newNodesData => {
      const newFlattenedNodes = {}
      newFlattenedNodes[ALL_ROOTS_COMBINED_KEY] = {
        [idKey]: ALL_ROOTS_COMBINED_KEY,
        uniqueKey: ALL_ROOTS_COMBINED_KEY,
        [childrenKey]: [],
      }

      flatten(newNodesData, newFlattenedNodes)
      setFlattenedNodes(prev => ({
        ...prev,
        ...newFlattenedNodes,
        [ALL_ROOTS_COMBINED_KEY]: {
          [idKey]: ALL_ROOTS_COMBINED_KEY,
          uniqueKey: ALL_ROOTS_COMBINED_KEY,
          [childrenKey]: [
            ...prev[ALL_ROOTS_COMBINED_KEY]?.[childrenKey],
            ...newFlattenedNodes[ALL_ROOTS_COMBINED_KEY][childrenKey],
          ],
        },
      }))
    },
    [childrenKey, flatten, idKey],
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

      flatten(treeData, flattenedNodesMap, selectedKeysSetOrObj, layer)
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
    updateAmountOfSelectedNodesAndChildren,
    handleAddNewFlattenedNodes,
    handleSetSelectedNodesFromKeysArr,
    handleSetSelectedNodesFromKeysObject,
  }
}

export default useFlattenTreeData
