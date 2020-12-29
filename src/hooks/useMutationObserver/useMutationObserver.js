import { useEffect } from 'react'

const config = {
  childList: true,
  attributes: true,
  subtree: true,
}

const useMutationObserver = (element, callback, options = config) => {
  useEffect(() => {
    console.log('popo')
    // Create an observer instance linked to the callback function
    if (element && callback) {
      console.log('create observer')
      const observer = new MutationObserver(callback)

      // Start observing the target node for configured mutations
      observer.observe(element, options)
      return () => {
        console.log('disconnect')
        observer.disconnect()
      }
    }
  }, [callback, element, options])
}

export default useMutationObserver
