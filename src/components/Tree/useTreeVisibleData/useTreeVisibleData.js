import { useCallback, useState, useRef } from 'react'

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

  const searchInputRef = useRef()
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredData, setFilteredData] = useState(
    filterVisibleData(initialData, searchQuery.trim().toLowerCase()),
  )
  const [specificNodeSearchData, setSpecificNodeSearchData] = useState(null)

  const handleSpecificNodeSearchData = useCallback(
    node => {
      setSpecificNodeSearchData(node)
      searchInputRef.current?.focus()
      treeInstance?.state.recomputeTree({
        opennessState: { [node.key]: true },
        refreshNodes: true,
      })
    },
    [treeInstance],
  )

  const handleResetSearchData = useCallback(() => {
    setSearchQuery('')
    if (!!specificNodeSearchData) {
      setAllNodesAsVisible([specificNodeSearchData])
    } else {
      setAllNodesAsVisible(filteredData)
    }
  }, [filteredData, setAllNodesAsVisible, specificNodeSearchData])

  const handleSearch = ({ target: { value } }) => {
    setSearchQuery(value)
    onSearch(value)
    const searchKeyword = value.trim().toLowerCase()

    if (!!specificNodeSearchData)
      return filterVisibleData([specificNodeSearchData], searchKeyword)

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
    searchInputRef,
    specificNodeSearchData,
    setSpecificNodeSearchData,
    handleSpecificNodeSearchData,
  }
}

export default useTreeVisibleData
