export const isFunction = func => typeof func === 'function'
export const generateId = () => `_${Math.random().toString(36).substr(2, 9)}`

export const throttle = (callback, waitMs = 700) => {
  let wait = false
  return () => {
    if (!wait) {
      callback()
      wait = true
      setTimeout(() => (wait = false), waitMs)
    }
  }
}
