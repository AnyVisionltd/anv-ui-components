import { useCallback, useState, useEffect } from 'react'
import { ALL_ROOTS_COMBINED_KEY } from '../utils'

const useTreeVisibleData = ({
  initialData,
  onSearch,
  treeInstance,
  childrenKey,
  labelKey,
  idKey,
}) => {
  const setAllNodesAsVisible = useCallback(
    (data, parentKey = ALL_ROOTS_COMBINED_KEY) => {
      const setAllVisible = nodes => {
        nodes.forEach(node => {
          node.visible = true
          node.parentKey = parentKey
          if (node[childrenKey]) {
            node.isParentNode = true
            setAllNodesAsVisible(node[childrenKey], node[idKey])
          }
        })
      }

      setAllVisible(data)
      return data
    },
    [childrenKey, idKey],
  )

  const filterVisibleData = useCallback(
    (data, searchKeyword, parentKey = ALL_ROOTS_COMBINED_KEY) => {
      const setVisible = nodes =>
        nodes.forEach(node => {
          node.visible = node[labelKey].toLowerCase().startsWith(searchKeyword)
          node.parentKey = parentKey
          if (Array.isArray(node[childrenKey])) {
            node.isParentNode = true
            if (node.visible) {
              setAllNodesAsVisible(node[childrenKey], node[idKey])
            } else {
              filterVisibleData(node[childrenKey], searchKeyword, node[idKey])
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
    [childrenKey, idKey, labelKey, setAllNodesAsVisible],
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

    treeInstance?.state?.recomputeTree({
      refreshNodes: true,
    })
  }

  useEffect(() => {
    if (filteredData.length < initialData.length) {
      setFilteredData(
        filterVisibleData(initialData, searchQuery.trim().toLowerCase()),
      )
    }
  }, [filterVisibleData, filteredData, initialData, searchQuery])

  return {
    searchQuery,
    filteredData,
    resetSearchData: handleResetSearchData,
    handleSearch,
    handleAddNewNodes,
  }
}

export default useTreeVisibleData
