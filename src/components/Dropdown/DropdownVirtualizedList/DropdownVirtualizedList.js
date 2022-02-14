import React, { useEffect, useRef } from 'react'
import { FixedSizeList as List } from 'react-window'
import propTypes from 'prop-types'
import AutoSizer from 'react-virtualized-auto-sizer'
import styles from './DropdownVirtualizedList.module.scss'

const BORDER_WIDTH = 1

const Option = ({ data, index, style }) => {
  const { options, renderRow, width } = data
  const content = renderRow(options[index], index)
  const rowStyle = { ...style, maxWidth: width - 2 * BORDER_WIDTH }

  return <div style={rowStyle}>{content}</div>
}

const DropdownVirtualizedList = ({
  menuHeight,
  options,
  rowHeight,
  renderRow,
  focusedOptionIndex,
}) => {
  const virtualizedListRef = useRef()

  useEffect(() => {
    if (focusedOptionIndex === -1) return
    virtualizedListRef.current?.scrollToItem(focusedOptionIndex)
  }, [focusedOptionIndex])

  return (
    <AutoSizer disableHeight>
      {({ width }) => (
        <List
          className={styles.dropdownVirtualizedList}
          ref={virtualizedListRef}
          height={menuHeight}
          width={width}
          itemCount={options.length}
          itemSize={rowHeight}
          itemData={{
            options,
            renderRow,
            width,
          }}
          scrollToItem={focusedOptionIndex}
        >
          {Option}
        </List>
      )}
    </AutoSizer>
  )
}

DropdownVirtualizedList.propTypes = {
  /** Height of menu list. */
  menuHeight: propTypes.number,
  /** Options array. */
  options: propTypes.array,
  /** Height of row in list. */
  rowHeight: propTypes.number,
  /** Render function for a row in list. */
  renderRow: propTypes.func,
  /** Currently focused option by user. */
  focusedOptionIndex: propTypes.number,
}

export default DropdownVirtualizedList
