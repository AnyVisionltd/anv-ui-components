import { useState, useLayoutEffect } from 'react'

const checkOverflow = element => {
  if (!element) {
    return false
  }
  return (
    element.clientWidth < element.scrollWidth ||
    element.clientHeight < element.scrollHeight
  )
}

const useIsOverflowing = ref => {
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
