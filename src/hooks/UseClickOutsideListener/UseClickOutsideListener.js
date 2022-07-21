import { useCallback, useEffect } from 'react'
import { isFunction } from '../../utils'

const useClickOutsideListener = (onClickOutside, ref, refToIgnore = {}) => {
  const onClickOutsideHandler = useCallback(
    event => {
      if (
        ref &&
        ref.current &&
        isFunction(ref.current.contains) &&
        onClickOutside &&
        !ref.current.contains(event.target)
      ) {
        if (refToIgnore?.current?.contains(event.target)) {
          return
        }
        onClickOutside(event)
      }
    },
    [onClickOutside, ref, refToIgnore],
  )
  useEffect(() => {
    document.addEventListener('mouseup', onClickOutsideHandler)
    return () => document.removeEventListener('mouseup', onClickOutsideHandler)
  }, [onClickOutsideHandler])
}

export default useClickOutsideListener
