export const setNodesSelectedStatus = (data, map, isSelected) => {
  const keys = []

  const setAllSelected = nodes => {
    nodes.forEach(node => {
      const { key, children } = node
      map[key].isSelected = isSelected
      keys.push(key)
      if (children) {
        setAllSelected(children)
      }
    })
  }

  setAllSelected(data)
  return { map, keys }
}
