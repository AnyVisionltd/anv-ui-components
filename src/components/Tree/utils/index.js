export const ALL_ROOTS_COMBINED_KEY = 'ALL_ROOTS_COMBINED_KEY'

export const emptyListTypes = Object.freeze({
  NO_ITEMS_IN_LIST: 0,
  NO_RESULTS_FOUND: 1,
})

export const setNodesSelectedStatus = ({
  nodesTree,
  nodesMap,
  isSelected,
  childrenKey,
  idKey,
}) => {
  const keys = { added: [], removed: [] }
  const currentUsedArr = isSelected ? keys.added : keys.removed

  const setAllSelected = nodes => {
    nodes.forEach(node => {
      const { [idKey]: key, [childrenKey]: children } = node
      if (children) {
        setAllSelected(children)
      } else {
        const previousSelectedStatus = nodesMap[key].isSelected
        nodesMap[key].isSelected = isSelected
        if (isSelected !== previousSelectedStatus) {
          currentUsedArr.push(key)
        }
      }
    })
  }

  setAllSelected(nodesTree)
  return { nodesMap, keys }
}

export const setNodesExpandedStatus = ({
  nodesTree,
  isOpen,
  idKey,
  childrenKey,
}) =>
  nodesTree.reduce(
    (parentNodesObj, { [idKey]: key, [childrenKey]: children }) => {
      if (!children) return parentNodesObj
      parentNodesObj[key] = isOpen
      return {
        ...parentNodesObj,
        ...setNodesExpandedStatus({
          nodesTree: children,
          isOpen,
          idKey,
          childrenKey,
        }),
      }
    },
    {},
  )

export const checkAllNodesAreExpanded = ({
  nodesTree,
  nodesVirualizedMap,
  idKey,
  childrenKey,
}) => {
  if (!nodesVirualizedMap) return false
  let areExpanded = true

  const areAllNodesExpanded = nodesTreeData => {
    nodesTreeData.forEach(node => {
      const { [idKey]: key, [childrenKey]: children } = node
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
