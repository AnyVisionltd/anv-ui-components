import { useCallback, useEffect } from 'react'
import { isFunction } from '../../utils'

const useClickOutsideListener = (onClickOutside, ref) => {
  const onClickOutsideHandler = useCallback(
    event => {
      if (
        ref &&
        ref.current &&
        isFunction(ref.current.contains) &&
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
