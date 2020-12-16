import { useCallback, useEffect } from 'react'

const UseKeyDownListener = (keyDownHandlersMap, addEventListener = true) => {
  const onKeyDownHandler = useCallback(
    event =>
      keyDownHandlersMap[event.keyCode] &&
      keyDownHandlersMap[event.keyCode](event),
    [keyDownHandlersMap],
  )
  useEffect(() => {
    addEventListener && document.addEventListener('keydown', onKeyDownHandler)
    return () => document.removeEventListener('keydown', onKeyDownHandler)
  }, [addEventListener, onKeyDownHandler])
}

export default UseKeyDownListener
