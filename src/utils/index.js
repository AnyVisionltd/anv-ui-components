export const isEqual = (obj1, obj2) => {
  const atLeastOneNotObject = typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null
  if (atLeastOneNotObject) {
    return obj1 === obj2
  }
  const props = [...new Set([...Object.keys(obj1), ...Object.keys(obj2)])]
  return props.every(prop => isEqual(obj1[prop], obj2[prop]))
}