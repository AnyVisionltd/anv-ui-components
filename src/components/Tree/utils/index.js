export const getChildrenKeys = (children, conditionKey) => {
  const keys = []

  const traverse = childrenData => {
    childrenData.forEach(node => {
      const { key, children } = node
      if (conditionKey) {
        if (node[conditionKey]) {
          keys.push(key)
        }
      } else {
        keys.push(key)
      }
      if (children) {
        traverse(children)
      }
    })
  }

  traverse(children)
  return keys
}

export const getNodeParents = node => {
  const parents = []
  const traverse = node => {
    if (node.parentKey) {
      traverse(node.parentKey)
      parents.push(node.parentKey)
    }
  }

  traverse(node)
  return parents
}
