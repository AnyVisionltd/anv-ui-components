import { useCallback, useEffect } from 'react'

const UseKeyDownListener = keyDownHandlersMap => {
  const onKeyDownHandler = useCallback(
    event => keyDownHandlersMap[event.keyCode] && keyDownHandlersMap[event.keyCode](event),
    [keyDownHandlersMap],
  )
  useEffect(() => {
    document.addEventListener('keydown', onKeyDownHandler)
    return () => document.removeEventListener('keydown', onKeyDownHandler)
  }, [onKeyDownHandler])
}

export default UseKeyDownListener
