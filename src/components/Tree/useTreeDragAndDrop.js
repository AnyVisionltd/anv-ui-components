import { useDebounce } from '../../hooks/UseDebounce'
import { getNodeParents } from './utils'

function useTreeDragDrop({ onDropCallback, nodesMap }) {
  const { set } = useDebounce(500)

  function isValidToDragTo(e, node) {
    const currentEl = e.currentTarget
    const draggedId = e.dataTransfer.types[1].toLowerCase()

    if (currentEl.id.toLowerCase() === draggedId) return false
    const parents = getNodeParents(node.id, nodesMap).map(p => p.toLowerCase())
    return !parents.includes(draggedId)
  }

  function onDragStart(e) {
    const currentEl = e.currentTarget
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('dragged', currentEl.id)
    e.dataTransfer.setData(currentEl.id, 'draggedIdInDataTransferTypes') // STORE the id as the key to get it on the onDragOver
    currentEl.classList.add('drag-start')
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
