import { useState, useCallback, useEffect } from 'react'
import { checkAllNodesAreExpanded, checkAllNodesAreSelected } from '../utils'

const useFlattenTreeData = ({ data, selectedKeys = [] }) => {
  const [flattenNodes, setFlattenNodes] = useState({})
  const [areAllNodesExpanded, setAreAllNodesExpanded] = useState(false)
  const [areAllNodesSelected, setAreAllNodesSelected] = useState(false)

  const amountOfSelectedNodesAndTotalChildren = useCallback(() => {
    if (!Object.keys(flattenNodes).length) {
      return () => ({})
    }

    const memo = new Map()

    const calculateAmountOfSelectedNodesAndChildren = nodeKey => {
      if (memo.has(nodeKey)) return memo.get(nodeKey)
      const { isSelected, children } = flattenNodes[nodeKey]
      if (children) {
        const nodeMemoValue = {
          totalChildren: children.filter(
            childNode => !Array.isArray(childNode.children),
          ).length,
          totalSelected: 0,
        }
        children.forEach(({ key }) => {
          const {
            totalChildren,
            totalSelected,
          } = calculateAmountOfSelectedNodesAndChildren(key)
          nodeMemoValue.totalChildren += totalChildren
          nodeMemoValue.totalSelected += totalSelected
        })
        memo.set(nodeKey, nodeMemoValue)
        return nodeMemoValue
      } else {
        return { totalChildren: 0, totalSelected: isSelected ? 1 : 0 }
      }
    }

    return nodeKey => calculateAmountOfSelectedNodesAndChildren(nodeKey)
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
      return flattenNodesMap
    },
    [],
  )

  useEffect(() => {
    setFlattenNodes(flattenTreeData(data, new Set(selectedKeys)))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  useEffect(() => {
    console.log(data, flattenNodes)
    if (!Object.keys(flattenNodes).length) return
    const areAllExpanded = checkAllNodesAreExpanded(data, flattenNodes)
    const areAllSelected = checkAllNodesAreSelected(data, flattenNodes)

    areAllExpanded !== areAllNodesExpanded &&
      setAreAllNodesExpanded(areAllExpanded)
    areAllSelected !== areAllNodesSelected &&
      setAreAllNodesSelected(areAllSelected)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flattenNodes])

  return {
    flattenNodes,
    setFlattenNodes,
    calculateAmountOfSelectedNodesAndChildren: amountOfSelectedNodesAndTotalChildren(),
    areAllNodesSelected,
    areAllNodesExpanded,
  }
}

export default useFlattenTreeData
