import { useState, useCallback, useEffect, useRef } from 'react'
import { ALL_ROOTS_COMBINED_KEY } from '../Tree'

const useFlattenTreeData = ({ data, selectedKeys = [], maxNestingLevel }) => {
  const [flattenedNodes, setFlattenedNodes] = useState({})
  const nodeKeysMap = useRef(new Map())

  const flatten = useCallback(
    (treeData, nodesMap, selectedKeysSet = new Set(), layer = 0) => {
      if (!Array.isArray(treeData) || treeData.length === 0) {
        return
      }

      treeData.forEach(node => {
        const { key, children, parentKey } = node

        if (layer === 0) {
          nodesMap[ALL_ROOTS_COMBINED_KEY].children.push({ key })
        }

        let isSelected = false
        if (selectedKeysSet.has(key)) {
          isSelected = true
          selectedKeysSet.delete(key)
        }

        const isParentSelected = nodesMap[parentKey]?.isSelected

        nodesMap[key] = {
          ...node,
          children: children ? children.map(({ key }) => ({ key })) : undefined,
          layer,
          isSelected: isParentSelected ? isParentSelected : isSelected,
          isExpanded: false,
        }
        // eslint-disable-next-line no-unused-vars
        flatten(children, nodesMap, selectedKeysSet, layer + 1)
      })
    },
    [],
  )

  const getTotalNodeChildren = useCallback(
    (children, nodeNesingLevel) => {
      // It means that the current parentNode has only leaves so no need to filter
      if (maxNestingLevel - nodeNesingLevel === 1) return children.length
      return children.filter(({ key }) => !flattenedNodes[key]?.isParentNode)
        .length
    },
    [flattenedNodes, maxNestingLevel],
  )

  const calculateAmountOfSelectedNodesAndChildren = useCallback(
    (nodeKey, isUpdate) => {
      if (!Object.keys(flattenedNodes).length) return {}
      if (!isUpdate && nodeKeysMap.current.has(nodeKey))
        return nodeKeysMap.current.get(nodeKey)
      const { isSelected, children, layer } = flattenedNodes[nodeKey] || {}
      if (children) {
        const nodeCachedValue = {
          totalChildren: getTotalNodeChildren(children, layer),
          totalSelected: 0,
        }
        children.forEach(({ key }) => {
          const {
            totalChildren,
            totalSelected,
          } = calculateAmountOfSelectedNodesAndChildren(key, isUpdate)
          nodeCachedValue.totalChildren += totalChildren
          nodeCachedValue.totalSelected += totalSelected
        })
        nodeKeysMap.current.set(nodeKey, nodeCachedValue)
        return nodeCachedValue
      } else {
        return { totalChildren: 0, totalSelected: isSelected ? 1 : 0 }
      }
    },
    [flattenedNodes, getTotalNodeChildren],
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
        key: ALL_ROOTS_COMBINED_KEY,
        children: [],
      }

      flatten(newNodesData, newFlattenedNodes)
      setFlattenedNodes(prev => ({
        ...prev,
        ...newFlattenedNodes,
        [ALL_ROOTS_COMBINED_KEY]: {
          key: ALL_ROOTS_COMBINED_KEY,
          children: [
            ...prev[ALL_ROOTS_COMBINED_KEY].children,
            ...newFlattenedNodes[ALL_ROOTS_COMBINED_KEY].children,
          ],
        },
      }))
    },
    [flatten],
  )

  const flattenTreeData = useCallback(
    (treeData, selectedKeysSet, layer = 0) => {
      const flattenedNodesMap = {}
      flattenedNodesMap[ALL_ROOTS_COMBINED_KEY] = {
        key: ALL_ROOTS_COMBINED_KEY,
        children: [],
      }

      flatten(treeData, flattenedNodesMap, selectedKeysSet, layer)
      setFlattenedNodes(flattenedNodesMap)
    },
    [flatten],
  )

  useEffect(() => {
    if (Object.keys(flattenedNodes).length) return
    flattenTreeData(data, new Set(selectedKeys))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  return {
    flattenedNodes,
    setFlattenedNodes,
    calculateAmountOfSelectedNodesAndChildren,
    updateAmountOfSelectedNodesAndChildren,
    handleAddNewFlattenedNodes,
  }
}

export default useFlattenTreeData
