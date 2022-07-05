import React, { FC, ReactElement, useEffect, useRef, useState } from 'react'
import { Checkbox } from '../../../../../Checkbox'
import { InfiniteList } from '../../../../../InfiniteList'
import { Tooltip } from '../../../../../Tooltip'
import { ListItemInterface } from '../../../../utils'
import styles from './FilterList.module.scss'

const offset = 10
const rowHeight = 32

interface FilterListProps {
  onCheckItem: (id: string) => void
  checkedItems: Record<string, boolean>
  items: Array<ListItemInterface>
}

const FilterList: FC<FilterListProps> = ({
  items,
  onCheckItem,
  checkedItems,
}): ReactElement => {
  const listRef = useRef()
  const [itemsToShow, setItemsToShow] = useState(items.slice(0, offset))
  const totalCount = items.length

  useEffect(() => {
    setItemsToShow(prev => items.slice(0, prev.length || offset))
  }, [items])

  const onLoadMoreItems = () => {
    setItemsToShow(prev => items.slice(0, offset + prev.length))
  }

  const rowRender = item => {
    return (
      <div
        className={styles.rowItemContainer}
        onClick={() => onCheckItem(item.id)}
      >
        <Checkbox
          checked={checkedItems[item.id]}
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
      <InfiniteList
        ref={listRef}
        rowRender={rowRender}
        totalItems={totalCount}
        loadMoreItems={onLoadMoreItems}
        rowHeight={rowHeight}
        items={itemsToShow}
      />
    </div>
  )
}

export default FilterList
