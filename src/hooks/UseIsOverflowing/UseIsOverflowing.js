import { useState, useEffect } from 'react'

function checkOverflow(element) {
  console.log(element)
  if (!element) {
    return false
  }
  const curOverflow = element.style.overflow
  if (!curOverflow || curOverflow === 'visible')
    element.style.overflow = 'hidden'
  const isOverflowing =
    element.clientWidth < element.scrollWidth ||
    element.clientHeight < element.scrollHeight
  element.style.overflow = curOverflow
  return isOverflowing
}

function useIsOverflowing(ref) {
  const [nodeRef, setNodeRef] = useState(ref.current)
  const [isOverflowing, setIsOverflowing] = useState()

  useEffect(() => {
    if (!ref.current || nodeRef) return
    setNodeRef(ref.current)
    setIsOverflowing(checkOverflow(ref.current))
  }, [ref, nodeRef])

  return isOverflowing
}

export default useIsOverflowing
