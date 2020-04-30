import { useState, useEffect } from 'react'

const getContainerDimensions = (container = window) => {
  if (container === window) {
    const { innerWidth: width, innerHeight: height } = window
    return { width, height }
  }

  const { clientWidth: width, clientHeight: height } = container.offsetParent
  return { width, height }
}

const useContainerDimensions = () => {
  const [containerDimensions, setContainerDimensions] = useState(getContainerDimensions())

  useEffect(() => {
    const handleResize = () => setContainerDimensions(getContainerDimensions())
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return containerDimensions
}

export default useContainerDimensions
