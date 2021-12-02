import { useCallback, useState } from 'react'
import { ALL_ROOTS_COMBINED_KEY } from '../Tree'

const useTreeVisibleData = ({ initialData, onSearch, treeInstance }) => {
  const setAllNodesAsVisible = useCallback(
    (data, parentKey = ALL_ROOTS_COMBINED_KEY) => {
      const setAllVisible = nodes => {
        nodes.forEach(node => {
          node.visible = true
          node.parentKey = parentKey
          if (node.children) {
            node.isParentNode = true
            setAllVisible(node.children, node.key)
          }
        })
      }

      setAllVisible(data)
      return data
    },
    [],
  )

  const filterVisibleData = useCallback(
    (data, searchKeyword, parentKey = ALL_ROOTS_COMBINED_KEY) => {
      const setVisible = nodes =>
        nodes.forEach(node => {
          node.visible = node.label.toLowerCase().startsWith(searchKeyword)
          node.parentKey = parentKey
          if (Array.isArray(node.children)) {
            node.isParentNode = true
            if (node.visible) {
              setAllNodesAsVisible(node.children, node.key)
            } else {
              filterVisibleData(node.children, searchKeyword, node.key)
              for (const child of node.children) {
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
    [setAllNodesAsVisible],
  )

  const [searchQuery, setSearchQuery] = useState('')
  const [filteredData, setFilteredData] = useState(
    filterVisibleData(initialData, searchQuery.trim().toLowerCase()),
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
    const searchKeyword = value.trim().toLowerCase()

    if (!searchKeyword) {
      setFilteredData(setAllNodesAsVisible(filteredData))
    } else {
      setFilteredData(filterVisibleData(filteredData, searchKeyword))
    }

    treeInstance.recomputeTree({
      refreshNodes: true,
    })
  }

  return {
    searchQuery,
    filteredData,
    resetSearchData: handleResetSearchData,
    handleSearch,
    handleAddNewNodes,
  }
}

export default useTreeVisibleData
