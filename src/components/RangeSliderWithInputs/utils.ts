export const DefaultMinRange = 0
export const DefaultMaxRange = 100
export const DefaultStepRange = 1
export const DefaultValueRange = 44

export const countDecimals = number => {
  const text = number.toString()
  const index = text.indexOf('.')
  return index === -1 ? 0 : text.length - index - 1
}

export const removeTrailingZeroesFromDecimal = (number, decimalsEnabled) => {
  if (decimalsEnabled === 0 && number) {
    return Math.trunc(number)
  }
  let value = number.toString()
  if (value.indexOf('.') === -1 && !countDecimals(value)) {
    return number
  }
  while (
    (value.slice(-1) === '0' || value.slice(-1) === '.') &&
    value.indexOf('.') !== -1 &&
    countDecimals(value) > decimalsEnabled
  ) {
    value = value.substr(0, value.length - 1)
  }
  return value
}

export const isEmptyString = val => val === ''

export enum THUMBS_MAP {
  min = 'min',
  max = 'max',
}
