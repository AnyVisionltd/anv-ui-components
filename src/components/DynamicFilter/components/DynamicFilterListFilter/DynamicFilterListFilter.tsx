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

const DynamicFilterListFilter: FC<DynamicFilterListFilterProps> = ({
  items,
  elementKey,
  filterItems,
}): ReactElement => {
  const { actions, state } = useContext(DynamicFilterContext)
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

  const isAllItemsChecked =
    !!filteredItems.length &&
    Object.values(checkedItems).every(isSelected => isSelected)

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
  }, [filterItems, filters.search, filters.selectFilter, items])

  useEffect(() => {
    setCheckedItems(prev =>
      filteredItems.reduce(
        (obj: any, item: ListItemInterface) => ({
          ...obj,
          [item.id]: !!prev[item.id],
        }),
        {},
      ),
    )
  }, [filteredItems])

  useEffect(() => {
    const updateItems = Object.keys(checkedItems).filter(id => checkedItems[id])
    updateElementsState({
      [elementKey]: {
        selectedItems: updateItems,
      },
    })
  }, [elementKey, updateElementsState, checkedItems])

  const onFilterChange = (filterKey: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value,
    }))
  }

  const onSelectAllFiles = () => {
    setCheckedItems(() =>
      filteredItems.reduce(
        (obj, item) => ({
          ...obj,
          [item.id]: !isAllItemsChecked,
        }),
        {},
      ),
    )
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
        <div className={styles.sectionCheckboxWrapper}>
          <Checkbox
            checked={isAllItemsChecked}
            onChange={onSelectAllFiles}
            disabled={filteredItems.length === 0}
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
          items={filteredItems}
          onCheckItem={onCheckItem}
          checkedItems={checkedItems}
        />
      </div>
    </div>
  )
}

export default DynamicFilterListFilter
