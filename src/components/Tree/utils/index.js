export const setNodesSelectedStatus = (nodesTree, nodesMap, isSelected) => {
  const keys = []

  const setAllSelected = nodes => {
    nodes.forEach(node => {
      const { key, children } = node
      nodesMap[key].isSelected = isSelected
      keys.push(key)
      if (children) {
        setAllSelected(children)
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

export const checkAllNodesAreSelected = (nodesTree, nodesMap) => {
  let areSelected = true

  const areAllNodesSelected = nodesTreeData => {
    console.log(nodesTreeData)
    if (!Array.isArray(nodesTreeData) || !nodesTreeData.length) return
    nodesTreeData.forEach(node => {
      console.log('node is ', node)
      if (!areSelected) return
      const { key, children } = node
      if (nodesMap[key]?.isSelected) {
        return areAllNodesSelected(children, nodesMap)
      } else {
        areSelected = false
      }
    })
  }
  areAllNodesSelected(nodesTree)

  return areSelected
}
