import { useState, useLayoutEffect } from 'react'

function checkOverflow(element) {
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
  const [isOverflowing, setIsOverflowing] = useState(
    checkOverflow(ref?.current),
  )

  useLayoutEffect(() => {
    if (!ref?.current || isOverflowing) return
    setIsOverflowing(checkOverflow(ref.current))
  }, [ref, isOverflowing])

  return isOverflowing
}

export default useIsOverflowing
