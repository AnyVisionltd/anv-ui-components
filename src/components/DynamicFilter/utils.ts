import { FC } from 'react'

export interface DynamicFilterStateInterface {
  isMenuOpen: boolean
  elementsState: Record<string, any>
}

export enum DateTimeVarientType {
  All = 'All',
  Time = 'Time',
  Duration = 'Duration',
}

export interface SortItemInterface {
  key: string
  title: string
}

export interface DynamicFilterDateTimeProps {
  from?: Date
  to?: Date
  varientType?: DateTimeVarientType
  otherPropsTo?: Record<string, any>
  otherPropsFrom?: Record<string, any>
}

export interface DynamicFilterInfiniteListFilterProps {
  items: Array<SortItemInterface>
  key: string
  withFilters?: boolean
  filterItems?: Array<SortItemInterface>
}

export interface DynamicFilterListFilterProps {
  items: Array<SortItemInterface>
  key: string
  withFilters?: boolean
  filterItems?: Array<SortItemInterface>
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

interface DynamicFilterProps {
  title: string
  onApply: (anyValue: any) => void
  onClose: () => void
  classname?: string
}

export interface DynamicFilterInterface extends FC<DynamicFilterProps> {
  DateTime: FC<DynamicFilterDateTimeProps>
  InfiniteListFilter: FC<DynamicFilterInfiniteListFilterProps>
  ListFilter: FC<DynamicFilterListFilterProps>
  Selection: FC<DynamicFilterSelectionProps>
  Slider: FC<DynamicFilterSliderProps>
  Sort: FC<DynamicFilterSortProps>
}

export const maxMenuElWidth = 480
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
