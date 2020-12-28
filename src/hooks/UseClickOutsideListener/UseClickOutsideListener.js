import { useCallback, useEffect } from 'react'

const useClickOutsideListener = (onClickOutside, ref) => {
  const onClickOutsideHandler = useCallback(
    event => {
      if (
        ref &&
        ref.current &&
        Object.values(ref.current).length &&
        onClickOutside &&
        !ref.current.contains(event.target)
      ) {
        onClickOutside(event)
      }
    },
    [onClickOutside, ref],
  )
  useEffect(() => {
    document.addEventListener('mouseup', onClickOutsideHandler)
    return () => document.removeEventListener('mouseup', onClickOutsideHandler)
  }, [onClickOutsideHandler])
}

export default useClickOutsideListener
