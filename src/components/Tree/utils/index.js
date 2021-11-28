export const setNodesSelectedStatus = (nodesTree, nodesMap, isSelected) => {
  const keys = []

  const setAllSelected = nodes => {
    nodes.forEach(node => {
      const { key, children } = node
      if (children) {
        setAllSelected(children)
      } else {
        nodesMap[key].isSelected = isSelected
        keys.push(key)
      }
    })
  }

  setAllSelected(nodesTree)
  return { nodesMap, keys }
}

export const checkAllNodesAreExpanded = (nodesTree, nodesMap) => {
  let areExpanded = true

  const areAllNodesExpanded = nodesTreeData => {
    nodesTreeData.forEach(node => {
      const { key, children } = node
      if (!children || !areExpanded) return
      if (nodesMap[key]?.isExpanded) {
        return areAllNodesExpanded(children, nodesMap)
      } else {
        areExpanded = false
      }
    })
  }
  areAllNodesExpanded(nodesTree)

  return areExpanded
}
