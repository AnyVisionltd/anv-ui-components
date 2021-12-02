export const emptyListTypes = Object.freeze({
  NO_ITEMS_IN_LIST: 0,
  NO_RESULTS_FOUND: 1,
})

export const setNodesSelectedStatus = (nodesTree, nodesMap, isSelected) => {
  const keys = { added: [], removed: [] }

  const setAllSelected = nodes => {
    nodes.forEach(node => {
      const { key, children } = node
      if (children) {
        setAllSelected(children)
      } else {
        const previousSelectedStatus = nodesMap[key].isSelected
        nodesMap[key].isSelected = isSelected
        if (isSelected !== previousSelectedStatus) {
          if (isSelected) {
            keys.added.push(key)
          } else {
            keys.removed.push(key)
          }
        }
      }
    })
  }

  setAllSelected(nodesTree)
  return { nodesMap, keys }
}

export const setNodesExpandedStatus = (nodesTree, isOpen) =>
  nodesTree.reduce((parentNodesObj, { key, children }) => {
    if (!children) return parentNodesObj
    parentNodesObj[key] = isOpen
    return { ...parentNodesObj, ...setNodesExpandedStatus(children, isOpen) }
  }, {})

export const checkAllNodesAreExpanded = (nodesTree, nodesVirualizedMap) => {
  if (!nodesVirualizedMap) return false
  let areExpanded = true

  const areAllNodesExpanded = nodesTreeData => {
    nodesTreeData.forEach(node => {
      const { key, children } = node
      if (!children || !areExpanded) return
      if (nodesVirualizedMap[key]?.isOpen) {
        return areAllNodesExpanded(children)
      } else {
        areExpanded = false
      }
    })
  }
  areAllNodesExpanded(nodesTree)

  return areExpanded
}
