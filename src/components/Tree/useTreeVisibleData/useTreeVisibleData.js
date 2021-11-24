import { useCallback, useState } from 'react'
import { getChildrenKeys } from '../utils'

const useTreeVisibleData = ({ initialData, onSearch }) => {
  const setAllNodesAsVisible = useCallback((data, parentKey = null) => {
    const setAllVisible = nodes => {
      nodes.forEach(node => {
        node.visible = true
        node.parentKey = parentKey
        if (node.children) {
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
            if (node.visible) {
              setAllNodesAsVisible(node.children, node.key)
            } else {
              filterVisibleData(node.children, searchKeyword)
              node.children.forEach(child => {
                if (child.visible) {
                  node.visible = child.visible
                }
              })
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

  const handleSetFilteredData = useCallback(
    data => {
      setFilteredData(filterVisibleData(data, searchQuery.trim().toLowerCase()))
    },
    [filterVisibleData, searchQuery],
  )

  const handleSearch = ({ target: { value } }) => {
    setSearchQuery(value)
    const searchKeyword = value.trim().toLowerCase()

    if (!searchKeyword) {
      setFilteredData(setAllNodesAsVisible(initialData))
      onSearch({ shouldDisplayAll: true })
      return
    }

    const filteredData = filterVisibleData(initialData, searchKeyword)
    setFilteredData(filteredData)
    // const visibleKeys = getChildrenKeys(filteredData, 'visible')
    onSearch({ shouldDisplayAll: false, data: filteredData })
  }

  return {
    searchQuery,
    filteredData,
    setFilteredData: handleSetFilteredData,
    handleSearch,
  }
}

export default useTreeVisibleData
