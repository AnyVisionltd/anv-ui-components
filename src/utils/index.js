export const isFunction = func => typeof func === 'function'
export const generateId = () => `_${Math.random().toString(36).substr(2, 9)}`

export const findScrollerNodeBottom = node => {
  if (!node) return
  let maxHeight = node.getBoundingClientRect().height
  let scrollerNodeBottom = node.getBoundingClientRect().bottom

  while (node !== null) {
    if (maxHeight > node.offsetHeight) return scrollerNodeBottom
    const { bottom, height } = node.getBoundingClientRect()
    maxHeight = height
    scrollerNodeBottom = bottom
    node = node.parentNode
  }

  return scrollerNodeBottom
}
