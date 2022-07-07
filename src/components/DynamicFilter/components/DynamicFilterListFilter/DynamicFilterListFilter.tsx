import React, { FC, ReactElement, useContext, useEffect, useState } from 'react'
import { Search } from '@anyvision/anv-icons'
import { useComponentTranslation } from '../../../../hooks/UseComponentTranslation'
import { Dropdown } from '../../../Dropdown'
import { TextField } from '../../../TextField'
import DynamicFilterContext from '../../store/DynamicFilterContext'
import { DynamicFilterListFilterProps, ListItemInterface } from '../../utils'
import { Checkbox } from '../../../Checkbox'
import FilterList from './components/FilterList/FilterList'
import styles from './DynamicFilterListFilter.module.scss'
import classNames from 'classnames'

const DynamicFilterListFilter: FC<DynamicFilterListFilterProps> = ({
  items,
  elementKey,
  filterItems,
  onChange,
  onLoadMoreData,
  unControlled,
  totalItems,
  isLoading,
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

  const onlyCheckedItems = Object.values(checkedItems).filter(
    isSelect => isSelect,
  )
  const isAllItemsSelected = Object.values(checkedItems).every(
    isSelected => isSelected,
  )
  const isAllItemsNotSelected = Object.values(checkedItems).every(
    isSelected => !isSelected,
  )

  const isAllItemsChecked: boolean = !unControlled
    ? !!filteredItems.length && isAllItemsSelected
    : isExcludeMode
    ? isAllItemsNotSelected
    : onlyCheckedItems.length === totalItems

  useEffect(() => {
    const filtered = items.filter(item => {
      const searchRes = item.value
        .toLowerCase()
        .includes(filters.search.toLowerCase())
      const isByType = item.type && filterItems
      const res = isByType
        ? item.type === filters.selectFilter?.id && searchRes
        : searchRes
      return res
    })

    setFilteredItems(filtered)
  }, [filterItems, filters, filters.search, filters.selectFilter, items])

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
      [elementKey]: {
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

  const isShowSelectAll =
    !isLoading &&
    !(unControlled && totalItems ? !totalItems : !filteredItems.length)

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
      />
      <div className={styles.listAndSelectWrapper}>
        <div
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
        />
      </div>
    </div>
  )
}

export default DynamicFilterListFilter
