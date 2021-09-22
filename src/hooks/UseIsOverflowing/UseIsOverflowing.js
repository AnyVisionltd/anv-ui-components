import { useState, useLayoutEffect } from 'react'

function checkOverflow(element) {
  if (!element) {
    return false
  }
  const isOverflowing =
    element.clientWidth < element.scrollWidth ||
    element.clientHeight < element.scrollHeight
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
