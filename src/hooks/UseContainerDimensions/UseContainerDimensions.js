import { useState, useEffect } from 'react'

const getContainerDimensions = (container) => {
  if (!container) {
    return {}
  }

  if (container === window) {
    const { innerWidth: width, innerHeight: height } = window
    return { width, height }
  }

  const { clientWidth: width, clientHeight: height } = container
  return { width, height }
}

const useContainerDimensions = (container = window) => {
  const [containerDimensions, setContainerDimensions] = useState(getContainerDimensions(container))

  useEffect(() => {
    const handleResize = () => setContainerDimensions(getContainerDimensions())

    if (container === window) {
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(container)
    return () => resizeObserver.unobserve(container)
  }, [container])

  return containerDimensions
}

export default useContainerDimensions
