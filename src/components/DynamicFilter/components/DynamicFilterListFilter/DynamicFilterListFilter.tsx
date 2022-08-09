import React, {
  FC,
  ReactElement,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import classNames from 'classnames'
import { Search } from '@anyvision/anv-icons'
import { useComponentTranslation } from '../../../../hooks/UseComponentTranslation'
import { TextField } from '../../../TextField'
import DynamicFilterContext from '../../store/DynamicFilterContext'
import { allOption, ListItemInterface, SortItemInterface } from '../../utils'
import { Checkbox } from '../../../Checkbox'
import FilterList from './components/FilterList/FilterList'
import { MenuSelect } from '../../../MenuSelect'
import styles from './DynamicFilterListFilter.module.scss'

interface DynamicFilterListFilterProps {
  /** List items - { id, value, type? }.*/
  items: Array<ListItemInterface>
  /** The key of the component, On - 'onApply' - the key contains the Result data.*/
  elementKey: string
  /** List Filter items - { id, value }.*/
  filterItems?: Array<SortItemInterface>
  /** List Filter default to All, and the All option is added. if false then default is the first item*/
  isAllDefault?: boolean
  /** Determine if the List is controlled or not.*/
  unControlled?: boolean
  /** If unControlled = true, a callback with the filters - 'search', 'selectFilter?' .*/
  onChange?: (filterBy: any) => void
  /** If unControlled = true, a callback for load more data .*/
  onLoadMoreData?: () => void
  /** If unControlled = true, the total number of items .*/
  totalItems?: number
  /** If unControlled = true, determine if the data is loading .*/
  isLoading?: boolean
  /**  Determine the number of items the  list load each time.*/
  offset?: number
  /** Label to add information about  the filter dropdown. */
  label?: string
  /** Determine if the parent element is dark or light theme*/
  isOnDarkTheme?: boolean
  /** The default value for the search input.*/
  defaultSearchValue?: string
  /** The default value ({ id, value }) for the filter, only when filterItems exists, and it must be one of them.*/
  defaultFilterValue?: SortItemInterface
  /** If unControlled = true, determine the selected items.*/
  selectedItems?: Array<ListItemInterface>
  /** Determine the default selected items - only on init component.*/
  defaultValues?: Array<ListItemInterface>
}

const DynamicFilterListFilter: FC<DynamicFilterListFilterProps> = ({
  items,
  elementKey,
  filterItems,
  isAllDefault = false,
  onChange,
  onLoadMoreData,
  unControlled = false,
  totalItems,
  isLoading = false,
  offset = 10,
  label,
  isOnDarkTheme = true,
  defaultSearchValue = '',
  defaultFilterValue,
  defaultValues,
  selectedItems,
}): ReactElement => {
  const { actions } = useContext(DynamicFilterContext)
  const { updateElementsState, setIsMenuDropdownOpen } = actions
  const { getComponentTranslation } = useComponentTranslation()
  const translations: Record<string, string> = getComponentTranslation(
    'dynamicFilterListFilter',
  )

  const [filters, setFilters] = useState({
    ...(filterItems && {
      selectFilter: defaultFilterValue
        ? defaultFilterValue
        : isAllDefault
        ? allOption
        : filterItems[0],
    }),
    search: defaultSearchValue,
  })
  const [filteredItems, setFilteredItems] = useState<Array<ListItemInterface>>(
    [],
  )
  const checkedItemsInit =
    defaultValues?.reduce(
      (obj: any, item: ListItemInterface) => ({
        ...obj,
        [item.id]: true,
      }),
      {},
    ) || {}
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(
    checkedItemsInit,
  )
  const [isExcludeMode, setIsExcludeMode] = useState<boolean>(false)

  const onlyCheckedItems = useMemo(
    () => Object.values(checkedItems).filter(isSelect => isSelect),
    [checkedItems],
  )
  const isAllItemsSelected = useMemo(
    () => Object.values(checkedItems).every(isSelected => isSelected),
    [checkedItems],
  )
  const isAllItemsNotSelected = useMemo(
    () => Object.values(checkedItems).every(isSelected => !isSelected),
    [checkedItems],
  )

  const isAllItemsChecked: boolean = useMemo(
    () =>
      !unControlled
        ? !!filteredItems.length && isAllItemsSelected
        : isExcludeMode
        ? isAllItemsNotSelected
        : onlyCheckedItems.length === totalItems,
    [
      filteredItems.length,
      isAllItemsNotSelected,
      isAllItemsSelected,
      isExcludeMode,
      onlyCheckedItems.length,
      totalItems,
      unControlled,
    ],
  )

  const isShowSelectAll: boolean = useMemo(
    () =>
      !isLoading &&
      !(unControlled && totalItems ? !items.length : !filteredItems.length),
    [filteredItems.length, isLoading, items, totalItems, unControlled],
  )

  useEffect(() => {
    if (unControlled) {
      return
    }
    const filtered = items.filter(item => {
      const searchRes = item.value
        .toLowerCase()
        .includes(filters.search.toLowerCase())
      const isByType = item.type && filterItems
      const res = isByType
        ? (filters.selectFilter?.id === allOption.id ||
            item.type === filters.selectFilter?.id) &&
          searchRes
        : searchRes
      return res
    })

    setFilteredItems(filtered)
  }, [
    filterItems,
    filters.search,
    filters.selectFilter?.id,
    items,
    unControlled,
    isAllDefault,
  ])

  useEffect(() => {
    if (unControlled && selectedItems) {
      setCheckedItems(() =>
        selectedItems.reduce(
          (obj: any, item: ListItemInterface) => ({
            ...obj,
            [item.id]: true,
          }),
          {},
        ),
      )
    }
  }, [unControlled, selectedItems])

  useEffect(() => {
    if (unControlled) {
      return
    }
    setCheckedItems(prev =>
      filteredItems.reduce(
        (obj: any, item: ListItemInterface) => ({
          ...obj,
          [item.id]: !!prev[item.id],
        }),
        {},
      ),
    )
  }, [filteredItems, unControlled])

  useEffect(() => {
    const updateItems = Object.keys(checkedItems).filter(id => checkedItems[id])
    updateElementsState({
      key: elementKey,
      value: {
        selectedItems: updateItems,
        ...(unControlled && { isExcludeMode }),
      },
    })
  }, [
    elementKey,
    updateElementsState,
    checkedItems,
    unControlled,
    isExcludeMode,
  ])

  const onFilterChange = (filterKey: string, value: any) => {
    const updatedFilters = {
      ...filters,
      [filterKey]: value,
    }
    if (unControlled && onChange) {
      onChange(updatedFilters)
    }
    setFilters(prev => ({
      ...prev,
      [filterKey]: value,
    }))
  }

  const onSelectAllFiles = () => {
    if (unControlled) {
      setIsExcludeMode(prev => {
        if (
          prev &&
          Object.values(checkedItems).some(isSelected => isSelected)
        ) {
          return prev
        }
        return !prev
      })
      setCheckedItems({})
    } else {
      setCheckedItems(() =>
        (unControlled ? items : filteredItems).reduce(
          (obj, item) => ({
            ...obj,
            [item.id]: !isAllItemsChecked,
          }),
          {},
        ),
      )
    }
  }

  const onCheckItem = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const fixedMenuItemsFilter = (isAllDefault
    ? [allOption, ...(filterItems || [])]
    : filterItems || []
  ).map((option: SortItemInterface) => ({
    element: option.value,
    callback: () => onFilterChange('selectFilter', option),
    isSelected: filters.selectFilter?.id === option.id,
    key: option.id,
  }))

  return (
    <div className={styles.listFilterContainer}>
      <span className={styles.title}>{translations.title}</span>
      {filterItems &&
        filters.selectFilter &&
        fixedMenuItemsFilter.length > 0 && (
          <MenuSelect
            menuContainerId={'filter-menu-' + elementKey}
            preferOpenDirection={'bottom-start'}
            items={fixedMenuItemsFilter}
            selectedData={filters.selectFilter.value}
            toggleCallback={setIsMenuDropdownOpen}
            label={label}
            className={(isOnDarkTheme && styles.menuOnDarkerSurface) as string}
          />
        )}
      <TextField
        // @ts-ignore
        className={styles.searchInput}
        trailingIcon={<Search />}
        placeholder={translations.searchPlaceholder}
        value={filters.search}
        onChange={({ target: { value } }) => onFilterChange('search', value)}
        data-testid={'search-filter-input'}
      />
      <div className={styles.listAndSelectWrapper}>
        <div
          data-testid={'select-all-container'}
          className={classNames(
            styles.sectionCheckboxWrapper,
            !isShowSelectAll && styles.hidden,
          )}
        >
          {
            // @ts-ignore
            <Checkbox
              checked={isAllItemsChecked}
              onChange={onSelectAllFiles}
              disabled={unControlled ? !items.length : !filteredItems.length}
              className={isOnDarkTheme && styles.checkBoxDarkMode}
            />
          }
          <span className={styles.sectionCheckboxLabel}>
            {translations.selectAll}
          </span>
        </div>
        <FilterList
          items={unControlled ? items : filteredItems}
          onCheckItem={onCheckItem}
          checkedItems={checkedItems}
          unControlled={unControlled}
          onLoadMoreData={onLoadMoreData}
          totalItems={
            unControlled && totalItems ? totalItems : filteredItems.length
          }
          isLoading={isLoading}
          translations={translations}
          isExcludeMode={isExcludeMode}
          offset={offset}
          isOnDarkTheme={isOnDarkTheme}
        />
      </div>
    </div>
  )
}

export default DynamicFilterListFilter
