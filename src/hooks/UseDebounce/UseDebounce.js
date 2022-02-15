import { useRef, useCallback } from 'react'

const useDebounce = (delay = 0) => {
  const timeoutRef = useRef()

  const clear = useCallback(() => {
    timeoutRef.current && clearTimeout(timeoutRef.current)
  }, [])

  const set = useCallback(
    cbFunction => {
      clear()
      timeoutRef.current = setTimeout(cbFunction, delay)
    },
    [clear, delay],
  )

  return { set }
}

export default useDebounce
