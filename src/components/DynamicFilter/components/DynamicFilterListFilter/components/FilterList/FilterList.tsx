import React, { FC, ReactElement, useEffect, useRef, useState } from 'react'
import { NoResults } from '@anyvision/anv-icons'
import { Checkbox } from '../../../../../Checkbox'
import { InfiniteList } from '../../../../../InfiniteList'
import { Spinner } from '../../../../../Spinner'
import { Tooltip } from '../../../../../Tooltip'
import { ListItemInterface } from '../../../../utils'
import styles from './FilterList.module.scss'

const rowHeight = 32
interface FilterListProps {
  onCheckItem: (id: string) => void
  checkedItems: Record<string, boolean>
  items: Array<ListItemInterface>
  unControlled?: boolean
  onLoadMoreData?: () => void
  totalItems: number
  isLoading?: boolean
  translations: Record<string, string>
  isExcludeMode: boolean
  offset: number
}

const FilterList: FC<FilterListProps> = ({
  items,
  onCheckItem,
  checkedItems,
  onLoadMoreData,
  unControlled,
  totalItems,
  isLoading,
  translations,
  isExcludeMode,
  offset,
}): ReactElement => {
  const listRef = useRef()
  const [itemsToShow, setItemsToShow] = useState<Array<ListItemInterface>>([])

  useEffect(() => {
    if (unControlled) {
      setItemsToShow(items)
    } else {
      setItemsToShow(prev => items.slice(0, prev.length || offset))
    }
  }, [items, unControlled])

  const onLoadMoreItems = () => {
    if (unControlled && onLoadMoreData) {
      onLoadMoreData()
    } else {
      setItemsToShow(prev => items.slice(0, offset + prev.length))
    }
  }

  const rowRender = (item: ListItemInterface) => {
    return (
      <div
        className={styles.rowItemContainer}
        onClick={() => onCheckItem(item.id)}
      >
        <Checkbox
          checked={
            isExcludeMode ? !checkedItems[item.id] : checkedItems[item.id]
          }
          onChange={undefined}
          indeterminate={undefined}
          disabled={undefined}
          view={undefined}
          className={undefined}
          id={undefined}
          renderIcon={undefined}
        />
        <Tooltip overflowOnly placement='right' content={item.value}>
          <div className={styles.rowItemValue}>{item.value}</div>
        </Tooltip>
      </div>
    )
  }

  return (
    <div className={styles.listContainer}>
      {items.length > 0 && isLoading && (
        <div className={styles.noDataContainer}>
          <div className={styles.noDataInnerContainer}>
            <Spinner size='giant' color='primary' />
            <span className={styles.title}>{translations.loading}</span>
          </div>
        </div>
      )}
      {items.length > 0 && !isLoading && (
        <InfiniteList
          ref={listRef}
          rowRender={rowRender}
          totalItems={totalItems}
          loadMoreItems={onLoadMoreItems}
          rowHeight={rowHeight}
          items={itemsToShow}
          isLoading={isLoading}
        />
      )}
      {!items.length && (
        <div className={styles.noDataContainer}>
          <div className={styles.noDataInnerContainer}>
            <NoResults className={styles.noResultSvg} />
            <span className={styles.title}>{translations.noResults}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default FilterList
