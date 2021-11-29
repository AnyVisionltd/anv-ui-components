import { useState, useCallback, useEffect } from 'react'
import { ALL_ROOTS_COMBINED_KEY } from '../Tree'

const useFlattenTreeData = ({ data, selectedKeys = [] }) => {
  const [flattenedNodes, setFlattenedNodes] = useState({})

  const amountOfSelectedNodesAndTotalChildren = useCallback(() => {
    if (!Object.keys(flattenedNodes).length) {
      return () => ({})
    }

    const nodeKeysMap = new Map()

    const calculateAmountOfSelectedNodesAndChildren = nodeKey => {
      if (nodeKeysMap.has(nodeKey)) return nodeKeysMap.get(nodeKey)
      const { isSelected, children } = flattenedNodes[nodeKey]
      if (children) {
        const nodeCachedValue = {
          totalChildren: children.filter(
            ({ key }) => !flattenedNodes[key]?.isParentNode,
          ).length,
          totalSelected: 0,
        }
        children.forEach(({ key }) => {
          const {
            totalChildren,
            totalSelected,
          } = calculateAmountOfSelectedNodesAndChildren(key)
          nodeCachedValue.totalChildren += totalChildren
          nodeCachedValue.totalSelected += totalSelected
        })
        nodeKeysMap.set(nodeKey, nodeCachedValue)
        return nodeCachedValue
      } else {
        return { totalChildren: 0, totalSelected: isSelected ? 1 : 0 }
      }
    }

    return nodeKey => calculateAmountOfSelectedNodesAndChildren(nodeKey)
  }, [flattenedNodes])

  const flattenTreeData = useCallback(
    (treeData, selectedKeysSet, layer = 0) => {
      const flattenedNodesMap = {}
      flattenedNodesMap[ALL_ROOTS_COMBINED_KEY] = {
        key: ALL_ROOTS_COMBINED_KEY,
        children: [],
      }

      const flatten = (treeData, selectedKeysSet, layer) => {
        if (!Array.isArray(treeData) || treeData.length === 0) {
          return
        }

        treeData.forEach(node => {
          const { key, children, parentKey } = node

          if (layer === 0) {
            flattenedNodesMap[ALL_ROOTS_COMBINED_KEY].children.push({ key })
          }

          let isSelected = false
          if (selectedKeysSet.has(key)) {
            isSelected = true
            selectedKeysSet.delete(key)
          }

          const isParentSelected = flattenedNodesMap[parentKey]?.isSelected

          flattenedNodesMap[key] = {
            ...node,
            children: children
              ? children.map(({ key }) => ({ key }))
              : undefined,
            layer,
            isSelected: isParentSelected ? isParentSelected : isSelected,
            isExpanded: false,
          }
          // eslint-disable-next-line no-unused-vars
          flatten(children, selectedKeysSet, layer + 1)
        })
      }

      flatten(treeData, selectedKeysSet, layer)
      return flattenedNodesMap
    },
    [],
  )

  useEffect(() => {
    setFlattenedNodes(flattenTreeData(data, new Set(selectedKeys)))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  return {
    flattenedNodes,
    setFlattenedNodes,
    calculateAmountOfSelectedNodesAndChildren: amountOfSelectedNodesAndTotalChildren(),
  }
}

export default useFlattenTreeData
