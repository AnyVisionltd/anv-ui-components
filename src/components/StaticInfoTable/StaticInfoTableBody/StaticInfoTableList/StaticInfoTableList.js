import React, { memo } from 'react'
import { FixedSizeList as List } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import styles from './StaticInfoTableList.module.scss'

const Item = memo(({ data, index, style }) => {
  const { rows, renderRow } = data
  const content = renderRow(rows[index], index)
  return <div style={style}>{content}</div>
})

const StaticInfoTableList = ({ data, rowHeight, renderRow }) => (
  <AutoSizer disableWidth>
    {({ height }) => (
      <List
        className={styles.staticInfoTableList}
        height={height}
        width='100%'
        itemCount={data.length}
        itemSize={rowHeight}
        itemData={{
          rows: data,
          renderRow,
        }}
      >
        {Item}
      </List>
    )}
  </AutoSizer>
)

export default StaticInfoTableList
