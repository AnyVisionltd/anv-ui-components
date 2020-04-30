import { useEffect } from 'react'

const useClickOutsideListener = (onClickOutside, ref) => {
  useEffect(() => {
    const onClickOutsideHandler = event => {
      if (ref && ref.current && onClickOutside && !ref.current.contains(event.target)) {
        onClickOutside(event)
      }
    }

    document.addEventListener('mouseup', onClickOutsideHandler)
    return () => document.removeEventListener('mouseup', onClickOutsideHandler)
  }, [])
}

export default useClickOutsideListener
