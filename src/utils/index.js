export const isFunction = func => typeof func === 'function'
export const generateId = () => `_${Math.random().toString(36).substr(2, 9)}`
