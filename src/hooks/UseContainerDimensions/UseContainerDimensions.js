import { useState, useEffect } from 'react'

const getContainerDimensions = (container = window) => {
  if (container && container.offsetParent) {
    const { clientWidth: width, clientHeight: height } = container.offsetParent
    return { width, height }
  }

  const { innerWidth: width, innerHeight: height } = window
  return { width, height }
}

const useContainerDimensions = (container) => {
  const [containerDimensions, setContainerDimensions] = useState(getContainerDimensions(container))

  useEffect(() => {
    const handleResize = () => setContainerDimensions(getContainerDimensions())
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return containerDimensions
}

export default useContainerDimensions
