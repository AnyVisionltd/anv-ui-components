import { useDebounce } from '../../hooks/UseDebounce'
import { getNodeParents } from './utils'

function useTreeDragDrop({ onDropCallback, nodesMap }) {
  const { set } = useDebounce(500)

  function isValidToDragTo(e, node) {
    const currentEl = e.currentTarget
    const draggedId = e.dataTransfer.types[1].toLowerCase()

    if (currentEl.id.toLowerCase() === draggedId) return false
    const parents = getNodeParents(node.id, nodesMap).map(parentNode =>
      parentNode.toLowerCase(),
    )
    return !parents.includes(draggedId)
  }

  function onDragStart({ currentTarget, dataTransfer }) {
    dataTransfer.effectAllowed = 'move'
    dataTransfer.setData('dragged', currentTarget.id)
    dataTransfer.setData(currentTarget.id, 'draggedIdInDataTransferTypes') // store the id as the key to use it later
    currentTarget.classList.add('drag-start')
  }

  function onDragOver(e, node) {
    e.preventDefault()
    if (!isValidToDragTo(e, node)) return
    e.currentTarget.classList.add('drag-over')
  }

  function onDragEnter(e, node, cb) {
    e.preventDefault()
    if (!isValidToDragTo(e, node)) return
    set(() => cb())
  }

  function onDragLeave(e) {
    e.currentTarget.classList.remove('drag-over')
  }

  function onDragEnd(e) {
    const currentEl = e.currentTarget
    e.preventDefault()
    currentEl.classList.remove('drag-start')
    currentEl.classList.remove('drag-over')
  }

  function onDrop(e) {
    const currentEl = e.currentTarget
    e.preventDefault()
    currentEl.classList.remove('drag-start')
    currentEl.classList.remove('drag-over')
    const dragTo = currentEl.id
    const dragged = e.dataTransfer.getData('dragged')
    if (dragTo.toLowerCase() !== dragged.toLowerCase()) {
      onDropCallback({ dragged, dragTo })
    }
    e.dataTransfer.clearData()
  }

  return {
    onDragStart,
    onDragEnter,
    onDragOver,
    onDragLeave,
    onDrop,
    onDragEnd,
  }
}

export { useTreeDragDrop }
