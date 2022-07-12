import moment from 'moment'

export interface DynamicFilterStateInterface {
  isMenuOpen: boolean
  elementsState: Record<string, any>
  isDatePickerOpen: boolean
  isMenuDropdownOpen: boolean
}

export enum DateTimeVariantType {
  All = 'All',
  Time = 'Time',
  Duration = 'Duration',
}

export interface SortItemInterface {
  id: string
  value: string
}
export interface ListItemInterface {
  id: string
  value: string
  type?: string
}

export interface UpdateElementState {
  key: string
  value: any
}

export const maxMenuElWidth = 540
export const DefaultMinRange = 0
export const DefaultMaxRange = 100
export const DefaultStepRange = 1
export const DefaultValueRange = 44
export const DefaultValueFrom = moment().subtract(2, 'days').toISOString()
export const DefaultValueTo = moment().toISOString()
export const maxDurationValue = 100
export const minDurationValue = 0
export const stepDuration = 1
export const DefaultVariantType = DateTimeVariantType.All

export enum DurationOptions {
  Days = 'days',
  Hours = 'hours',
  Minutes = 'minutes',
}

export const countDecimals = number => {
  const text = number.toString()
  const index = text.indexOf('.')
  return index === -1 ? 0 : text.length - index - 1
}

export const isEmptyString = val => val === ''

export const getDefaultDurationInputValue = (
  from: Date | string,
  to: Date | string,
) => {
  const transformTo = moment(to)
  const duration = moment.duration(transformTo.diff(from))
  return Math.floor(duration.asHours())
}
