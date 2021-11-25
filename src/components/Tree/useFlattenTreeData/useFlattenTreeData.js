import { useState, useCallback, useEffect } from 'react'

const useFlattenTreeData = ({ data, selectedKeys = [] }) => {
  const [flattenedNodes, setFlattenedNodes] = useState({})

  const amountOfSelectedNodes = useCallback(() => {
    if (!Object.keys(flattenedNodes).length) {
      return () => {}
    }
    const nodeKeysMap = new Map()

    const calculateAmountOfSelectedNodes = nodeKey => {
      if (nodeKeysMap.has(nodeKey)) return nodeKeysMap.get(nodeKey)
      const { isSelected, children } = flattenedNodes[nodeKey]
      if (children) {
        let selectedAmount = 0
        children.forEach(({ key }) => {
          selectedAmount += calculateAmountOfSelectedNodes(key)
        })
        nodeKeysMap.set(nodeKey, selectedAmount)
        return selectedAmount
      } else {
        const amount = isSelected ? 1 : 0
        nodeKeysMap.set(nodeKey, amount)
        return amount
      }
    }

    return nodeKey => calculateAmountOfSelectedNodes(nodeKey)
  }, [flattenedNodes])

  const flattenTreeData = useCallback(
    (treeData, selectedKeysSet, layer = 0) => {
      const flattenedNodesMap = {}

      const flatten = (treeData, selectedKeysSet, layer) => {
        if (!Array.isArray(treeData) || treeData.length === 0) {
          return
        }

        treeData.forEach(node => {
          const { key, children, parentKey } = node
          let isSelected = false
          if (selectedKeysSet.has(key)) {
            isSelected = true
            selectedKeysSet.delete(key)
          }

          const isParentSelected = flattenedNodesMap[parentKey]?.isSelected

          flattenedNodesMap[key] = {
            ...node,
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
    calculateAmountOfSelectedNodes: amountOfSelectedNodes(),
  }
}

export default useFlattenTreeData
