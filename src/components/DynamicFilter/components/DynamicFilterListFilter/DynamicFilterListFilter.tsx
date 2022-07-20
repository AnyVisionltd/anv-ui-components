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
import { Dropdown } from '../../../Dropdown'
import { TextField } from '../../../TextField'
import DynamicFilterContext from '../../store/DynamicFilterContext'
import { ListItemInterface, SortItemInterface } from '../../utils'
import { Checkbox } from '../../../Checkbox'
import FilterList from './components/FilterList/FilterList'
import styles from './DynamicFilterListFilter.module.scss'

interface DynamicFilterListFilterProps {
  /** List items - { id, value, type? }.*/
  items: Array<ListItemInterface>
  /** The key of the component, On - 'onApply' - the key contains the Resault data.*/
  elementKey: string
  /** List Filter items - { id, value }.*/
  filterItems?: Array<SortItemInterface>
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
}

const DynamicFilterListFilter: FC<DynamicFilterListFilterProps> = ({
  items,
  elementKey,
  filterItems,
  onChange,
  onLoadMoreData,
  unControlled = false,
  totalItems,
  isLoading = false,
  offset = 10,
}): ReactElement => {
  const { actions } = useContext(DynamicFilterContext)
  const { updateElementsState } = actions
  const { getComponentTranslation } = useComponentTranslation()
  const translations: Record<string, string> = getComponentTranslation(
    'dynamicFilterListFilter',
  )
  const [filters, setFilters] = useState({
    ...(filterItems && { selectFilter: filterItems[0] }),
    search: '',
  })
  const [filteredItems, setFilteredItems] = useState<Array<ListItemInterface>>(
    [],
  )
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})
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
      !(unControlled && totalItems ? !totalItems : !filteredItems.length),
    [filteredItems.length, isLoading, totalItems, unControlled],
  )

  useEffect(() => {
    if (unControlled) {
      return
    }
    const filtered = items.filter(item => {
      const searchRes = item.id
        .toLowerCase()
        .includes(filters.search.toLowerCase())
      const isByType = item.type && filterItems
      const res = isByType
        ? item.type === filters.selectFilter?.id && searchRes
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
  ])

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
    setFilters(prev => {
      const updatedFilters = {
        ...prev,
        [filterKey]: value,
      }
      if (unControlled && onChange) {
        onChange(updatedFilters)
      }
      return updatedFilters
    })
  }

  const onSelectAllFiles = () => {
    if (unControlled) {
      setIsExcludeMode(prev => !prev)
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

  return (
    <div className={styles.listFilterContainer}>
      <span className={styles.title}>{translations.title}</span>
      {filterItems && (
        <Dropdown
          options={filterItems}
          defaultValues={[filters.selectFilter]}
          onChange={options => onFilterChange('selectFilter', options[0])}
          className={styles.dropdown}
        />
      )}
      <TextField
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
          <Checkbox
            checked={isAllItemsChecked}
            onChange={onSelectAllFiles}
            disabled={unControlled ? !items.length : !filteredItems.length}
            indeterminate={undefined}
            view={undefined}
            className={undefined}
            id={undefined}
            renderIcon={undefined}
          />
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
        />
      </div>
    </div>
  )
}

export default DynamicFilterListFilter
