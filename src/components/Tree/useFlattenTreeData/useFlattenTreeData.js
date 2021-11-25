import { useState, useCallback, useEffect } from 'react'

const useFlattenTreeData = ({ data, selectedKeys = [] }) => {
  const [flattenNodes, setFlattenNodes] = useState({})

  const amountOfSelectedNodes = useCallback(() => {
    if (!Object.keys(flattenNodes).length) {
      return () => {}
    }
    const memo = new Map()

    const calculateAmountOfSelectedNodes = nodeKey => {
      if (memo.has(nodeKey)) return memo.get(nodeKey)
      const { isSelected, children } = flattenNodes[nodeKey]
      if (children) {
        let selectedAmount = 0
        children.forEach(({ key }) => {
          selectedAmount += calculateAmountOfSelectedNodes(key)
        })
        memo.set(nodeKey, selectedAmount)
        return selectedAmount
      } else {
        const amount = isSelected ? 1 : 0
        memo.set(nodeKey, amount)
        return amount
      }
    }

    return nodeKey => calculateAmountOfSelectedNodes(nodeKey)
  }, [flattenNodes])

  const flattenTreeData = useCallback(
    (treeData, selectedKeysSet, layer = 0) => {
      const flattenNodesMap = {}

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

          const isParentSelected = flattenNodesMap[parentKey]?.isSelected

          flattenNodesMap[key] = {
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
      return flattenNodesMap
    },
    [],
  )

  useEffect(() => {
    setFlattenNodes(flattenTreeData(data, new Set(selectedKeys)))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  return {
    flattenNodes,
    setFlattenNodes,
    calculateAmountOfSelectedNodes: amountOfSelectedNodes(),
  }
}

export default useFlattenTreeData
