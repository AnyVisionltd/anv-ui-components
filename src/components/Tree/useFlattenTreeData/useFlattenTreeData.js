import { useState, useCallback, useEffect, useRef } from 'react'
import { ALL_ROOTS_COMBINED_KEY } from '../utils'

const useFlattenTreeData = ({
  data,
  selectedKeys = [],
  maxNestingLevel,
  childrenKey,
  labelKey,
  idKey,
}) => {
  const [flattenedNodes, setFlattenedNodes] = useState({})
  const nodeKeysMap = useRef(new Map())
  const isSelectedKeysUpdatedAfterMount = useRef(false)

  const flatten = useCallback(
    (treeData, nodesMap, selectedKeysSet = new Set(), layer = 0) => {
      if (!Array.isArray(treeData) || treeData.length === 0) {
        return
      }

      treeData.forEach(node => {
        const { [idKey]: key, [childrenKey]: children, parentKey } = node

        if (layer === 0) {
          nodesMap[ALL_ROOTS_COMBINED_KEY][childrenKey].push({ [idKey]: key })
        }

        let isSelected = false
        if (selectedKeysSet.has(key)) {
          isSelected = true
          selectedKeysSet.delete(key)
        }

        const isParentSelected = nodesMap[parentKey]?.isSelected

        nodesMap[key] = {
          ...node,
          [childrenKey]: children
            ? children.map(({ [idKey]: key }) => ({ [idKey]: key }))
            : undefined,
          layer,
          isSelected: isParentSelected ? isParentSelected : isSelected,
        }
        // eslint-disable-next-line no-unused-vars
        flatten(children, nodesMap, selectedKeysSet, layer + 1)
      })
    },
    [childrenKey, idKey],
  )

  const getTotalNodeChildren = useCallback(
    (children, nodeNesingLevel) => {
      // It means that the current parentNode has only leaves so no need to filter
      if (maxNestingLevel - nodeNesingLevel === 1) return children.length
      return children.filter(
        ({ [idKey]: key }) => !flattenedNodes[key]?.isParentNode,
      ).length
    },
    [flattenedNodes, maxNestingLevel, idKey],
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
        children.forEach(({ [idKey]: key }) => {
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
    [childrenKey, flattenedNodes, getTotalNodeChildren, idKey],
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
        [childrenKey]: [],
      }

      flatten(newNodesData, newFlattenedNodes)
      setFlattenedNodes(prev => ({
        ...prev,
        ...newFlattenedNodes,
        [ALL_ROOTS_COMBINED_KEY]: {
          [idKey]: ALL_ROOTS_COMBINED_KEY,
          [childrenKey]: [
            ...prev[ALL_ROOTS_COMBINED_KEY][childrenKey],
            ...newFlattenedNodes[ALL_ROOTS_COMBINED_KEY][childrenKey],
          ],
        },
      }))
    },
    [childrenKey, flatten, idKey],
  )

  const handleSetSelectedNodesFromKeysArr = useCallback(
    selectedKeysArr => {
      if (!Object.keys(flattenedNodes).length) return
      selectedKeysArr.forEach(
        key =>
          (flattenedNodes[key] = { ...flattenedNodes[key], isSelected: true }),
      )
      calculateAmountOfSelectedNodesAndChildren(ALL_ROOTS_COMBINED_KEY, true)
    },
    [calculateAmountOfSelectedNodesAndChildren, flattenedNodes],
  )

  const flattenTreeData = useCallback(
    (treeData, selectedKeysSet, layer = 0) => {
      const flattenedNodesMap = {}
      flattenedNodesMap[ALL_ROOTS_COMBINED_KEY] = {
        [idKey]: ALL_ROOTS_COMBINED_KEY,
        [childrenKey]: [],
      }

      flatten(treeData, flattenedNodesMap, selectedKeysSet, layer)
      setFlattenedNodes(flattenedNodesMap)
    },
    [childrenKey, flatten, idKey],
  )

  useEffect(() => {
    if (Object.keys(flattenedNodes).length || !data.length) return
    flattenTreeData(data, new Set(selectedKeys))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  useEffect(() => {
    if (!isSelectedKeysUpdatedAfterMount.current && selectedKeys.length) {
      isSelectedKeysUpdatedAfterMount.current = true
      handleSetSelectedNodesFromKeysArr(selectedKeys)
    }
  }, [handleSetSelectedNodesFromKeysArr, selectedKeys])

  return {
    flattenedNodes,
    setFlattenedNodes,
    calculateAmountOfSelectedNodesAndChildren,
    updateAmountOfSelectedNodesAndChildren,
    handleAddNewFlattenedNodes,
    handleSetSelectedNodesFromKeysArr
  }
}

export default useFlattenTreeData
