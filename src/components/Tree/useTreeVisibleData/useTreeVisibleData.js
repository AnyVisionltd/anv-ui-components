import { useCallback, useState } from 'react'

const useTreeVisibleData = ({ initialData, onSearch, treeInstance }) => {
  const setAllNodesAsVisible = useCallback((data, parentKey = null) => {
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
  }, [])

  const filterVisibleData = useCallback(
    (data, searchKeyword, parentKey = null) => {
      const setVisible = nodes =>
        nodes.forEach(node => {
          node.visible = node.label.toLowerCase().startsWith(searchKeyword)
          node.parentKey = parentKey
          if (Array.isArray(node.children)) {
            node.isParentNode = true
            if (node.visible) {
              setAllNodesAsVisible(node.children, node.key)
            } else {
              filterVisibleData(node.children, searchKeyword)
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
    setAllNodesAsVisible(filteredData)
  }, [filteredData, setAllNodesAsVisible])

  const handleSearch = ({ target: { value } }) => {
    setSearchQuery(value)
    onSearch(value)
    const searchKeyword = value.trim().toLowerCase()

    if (!searchKeyword) {
      setFilteredData(setAllNodesAsVisible(initialData))
    } else {
      setFilteredData(filterVisibleData(initialData, searchKeyword))
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
