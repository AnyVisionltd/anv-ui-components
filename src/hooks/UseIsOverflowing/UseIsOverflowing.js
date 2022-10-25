import { useState, useLayoutEffect, useEffect } from 'react'

const checkOverflow = element => {
  if (!element) {
    return false
  }
  return (
    element.clientWidth < element.scrollWidth ||
    element.clientHeight < element.scrollHeight
  )
}

const useIsOverflowing = (ref, listenToWindowResize = false) => {
  const [isOverflowing, setIsOverflowing] = useState(
    checkOverflow(ref?.current),
  )

  const updateIsOverflow = () => {
    const isCurrentlyOverflowing = checkOverflow(ref.current)
    if (isCurrentlyOverflowing !== isOverflowing) {
      setIsOverflowing(isCurrentlyOverflowing)
    }
  }

  useLayoutEffect(() => {
    if (!ref?.current) return
    setIsOverflowing(checkOverflow(ref.current))
  }, [ref, isOverflowing])

  useEffect(() => {
    if (!listenToWindowResize) return
    window.addEventListener('resize', updateIsOverflow)
    return () => window.removeEventListener('resize', updateIsOverflow)
  })

  return isOverflowing
}

export default useIsOverflowing
