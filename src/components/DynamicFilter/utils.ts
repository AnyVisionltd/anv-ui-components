import moment from 'moment'
import { FC } from 'react'

export interface DynamicFilterStateInterface {
  isMenuOpen: boolean
  elementsState: Record<string, any>
  isDatePickerOpen: boolean
}

export enum DateTimeVarientType {
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
export interface DynamicFilterDateTimeProps {
  from?: Date
  to?: Date
  varientType?: DateTimeVarientType
  otherPropsTo?: Record<string, any>
  otherPropsFrom?: Record<string, any>
  elementKey: string
  title: string
}
export interface DynamicFilterListFilterProps {
  items: Array<ListItemInterface>
  elementKey: string
  filterItems?: Array<SortItemInterface>
  unControlled?: boolean
  onChange?: (filterBy: any) => void
  onLoadMoreData?: () => void
  totalItems?: number
  isLoading?: boolean
}
export interface DynamicFilterSelectionProps {
  items: Array<SortItemInterface>
  otherProps?: Record<string, any>
  elementKey: string
}
export interface DynamicFilterSliderProps {
  min?: number
  max?: number
  step?: number
  otherProps?: Record<string, any>
  elementKey: string
  title: string
  defaultValue?: number | Array<number>
}
export interface DynamicFilterSortProps {
  items: Array<SortItemInterface>
  otherProps?: Record<string, any>
  elementKey: string
}
export interface DynamicFilterProps {
  title: string
  onApply: (elementsState: Record<string, any>) => void
  onClose?: () => void
  classname?: string
}
export interface DynamicFilterInterface extends FC<DynamicFilterProps> {
  DateTime: FC<DynamicFilterDateTimeProps>
  ListFilter: FC<DynamicFilterListFilterProps>
  Selection: FC<DynamicFilterSelectionProps>
  Slider: FC<DynamicFilterSliderProps>
  Sort: FC<DynamicFilterSortProps>
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
export const DefaultVarientType = DateTimeVarientType.All

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

export const getDefaultDurationInputValue = (
  from: Date | string,
  to: Date | string,
) => {
  const transformTo = moment(to)
  const duration = moment.duration(transformTo.diff(from))
  return Math.floor(duration.asHours())
}