import { useState, useLayoutEffect } from 'react'

const checkOverflow = element => {
  console.log('element.clientWidth ', element?.clientWidth)
  console.log('element.scrollWidth ', element?.scrollWidth)

  if (!element) {
    return false
  }
  console.log(
    'element.clientWidth < element.scrollWidth',
    element.clientWidth < element.scrollWidth,
  )
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
    if (!ref?.current) return
    setIsOverflowing(checkOverflow(ref.current))
  }, [ref, isOverflowing])

  return isOverflowing
}

export default useIsOverflowing
