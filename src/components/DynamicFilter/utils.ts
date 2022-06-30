import { FC } from 'react'

export interface DynamicFilterStateInterface {
  isMenuOpen: boolean
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
  key: string
}

export interface DynamicFilterSliderProps {
  from?: number
  to?: number
  otherProps?: Record<string, any>
  key: string
}

export interface DynamicFilterSortProps {
  items: Array<SortItemInterface>
  otherProps?: Record<string, any>
  key: string
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
