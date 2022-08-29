import { useCallback, useState } from 'react'
import {
  ALL_ROOTS_COMBINED_KEY,
  getUniqueKey,
  setNodeValueInTreeFromPath,
} from '../utils'

const useTreeVisibleData = ({
  initialData,
  onSearch,
  treeInstance,
  childrenKey,
  labelKey,
  idKey,
  isChildrenUniqueKeysOverlap,
  selfControlled,
}) => {
  const setNodeProperties = useCallback(
    ({ node, parentKey, index }) => {
      if (node.uniqueKey) return
      node.parentKey = parentKey
      node.index = index
      node.uniqueKey = node[idKey]

      if (isChildrenUniqueKeysOverlap && parentKey !== ALL_ROOTS_COMBINED_KEY) {
        node.uniqueKey = getUniqueKey(parentKey, node[idKey])
      }
    },
    [idKey, isChildrenUniqueKeysOverlap],
  )

  const setAllNodesAsVisible = useCallback(
    (data, parentKey = ALL_ROOTS_COMBINED_KEY) => {
      const setAllVisible = nodes => {
        nodes.forEach((node, index) => {
          node.visible = true
          setNodeProperties({ node, parentKey, index })

          if (node[childrenKey]) {
            node.isParentNode = true
            setAllNodesAsVisible(node[childrenKey], node.uniqueKey)
          }
        })
      }

      setAllVisible(data)
      return data
    },
    [childrenKey, setNodeProperties],
  )

  const filterVisibleData = useCallback(
    (data, searchKeyword, parentKey = ALL_ROOTS_COMBINED_KEY) => {
      const setVisible = nodes =>
        nodes.forEach((node, index) => {
          node.visible = node[labelKey].toLowerCase().includes(searchKeyword)
          setNodeProperties({ node, parentKey, index })

          if (Array.isArray(node[childrenKey])) {
            node.isParentNode = true
            if (node.visible) {
              setAllNodesAsVisible(node[childrenKey], node.uniqueKey)
            } else {
              filterVisibleData(
                node[childrenKey],
                searchKeyword,
                node.uniqueKey,
              )
              for (const child of node[childrenKey]) {
                if (child.visible) {
                  node.visible = child.visible
                  break
                }
              }
            }
          }
        })

      setVisible(data)
      return data
    },
    [childrenKey, labelKey, setAllNodesAsVisible, setNodeProperties],
  )

  const [searchQuery, setSearchQuery] = useState('')
  const [filteredData, setFilteredData] = useState(
    filterVisibleData(
      initialData,
      selfControlled ? searchQuery.trim().toLowerCase() : '',
    ),
  )

  const handleSetNodeNewProperties = useCallback(
    (nodeKey, newProperties, nodePathArr) => {
      const newTreeData = setNodeValueInTreeFromPath({
        pathsArr: [...nodePathArr, nodeKey],
        treeData: [...filteredData],
        newProperties,
        childrenKey,
      })

      setFilteredData(newTreeData)
    },
    [childrenKey, filteredData],
  )

  const handleSetNewNodes = useCallback(
    newNodes => {
      setFilteredData(
        filterVisibleData(
          newNodes,
          selfControlled ? searchQuery.trim().toLowerCase() : '',
        ),
      )
    },
    [filterVisibleData, searchQuery, selfControlled],
  )

  const handleAddNewNodes = useCallback(
    nodesData => {
      setFilteredData(prev =>
        prev.concat(
          filterVisibleData(nodesData, searchQuery.trim().toLowerCase()),
        ),
      )
    },
    [filterVisibleData, searchQuery],
  )

  const handleResetSearchData = useCallback(() => {
    setSearchQuery('')
    setFilteredData(setAllNodesAsVisible(filteredData))
  }, [filteredData, setAllNodesAsVisible])

  const handleSearch = ({ target: { value } }) => {
    setSearchQuery(value)
    onSearch(value)
    if (!selfControlled) return

    const searchKeyword = value.trim().toLowerCase()

    if (!searchKeyword) {
      setFilteredData(setAllNodesAsVisible(filteredData))
    } else {
      setFilteredData(filterVisibleData(filteredData, searchKeyword))
    }

    treeInstance?.state?.recomputeTree({
      refreshNodes: true,
    })
  }

  return {
    searchQuery,
    filteredData,
    resetSearchData: handleResetSearchData,
    handleSearch,
    handleAddNewNodes,
    handleSetNodeNewProperties,
    handleSetNewNodes,
  }
}

export default useTreeVisibleData
