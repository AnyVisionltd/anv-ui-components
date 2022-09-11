import React, { forwardRef, useEffect } from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import { FixedSizeList as List, VariableSizeList } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'
import AutoSizer from 'react-virtualized-auto-sizer'
import mergeRefs from '../../utils/mergeRef'
import styles from './InfiniteList.module.scss'

const Item = ({ data, index, style }) => {
  const { items, rowRender, isItemLoaded, customLoader } = data
  let content
  if (!isItemLoaded(index)) {
    content = customLoader() ? customLoader() : null
  } else {
    content = rowRender(items[index], index)
  }

  return <div style={style}>{content}</div>
}

const InfiniteList = forwardRef(
  (
    {
      rowRender,
      customLoader,
      rowHeight,
      totalItems,
      items,
      loadMoreItems,
      isLoading,
      className,
      expandableRowMap,
      expandableHeight,
      isExpandable,
      ...otherProps
    },
    forwardRef,
  ) => {
    const hasNextPage = items.length < totalItems || isLoading
    const itemCount = hasNextPage ? items.length + 1 : items.length
    const loadMore = isLoading ? () => {} : loadMoreItems

    // Every row is loaded except for our loading indicator row.
    const isItemLoaded = index => !hasNextPage || index < items.length

    const classes = classNames(styles.infiniteList, className)

    const getHeight = idx => {
      return expandableRowMap[idx] ? expandableHeight + rowHeight : rowHeight
    }

    useEffect(() => {
      if (
        forwardRef &&
        forwardRef.current &&
        isExpandable &&
        expandableRowMap
      ) {
        forwardRef.current.resetAfterIndex(0)
      }
    }, [forwardRef, isExpandable, expandableRowMap, totalItems])

    return (
      <AutoSizer>
        {({ height, width }) => (
          <InfiniteLoader
            isItemLoaded={isItemLoaded}
            itemCount={itemCount}
            loadMoreItems={loadMore}
            threshold={0}
          >
            {({ onItemsRendered, ref }) =>
              isExpandable && expandableRowMap ? (
                <VariableSizeList
                  ref={mergeRefs(ref, forwardRef)}
                  className={classes}
                  height={height}
                  width={width}
                  itemData={{
                    items,
                    rowRender,
                    isItemLoaded,
                    customLoader,
                    rowHeight: rowHeight,
                  }}
                  itemCount={itemCount}
                  itemSize={getHeight}
                  onItemsRendered={onItemsRendered}
                  {...otherProps}
                >
                  {Item}
                </VariableSizeList>
              ) : (
                <List
                  ref={mergeRefs(ref, forwardRef)}
                  className={classes}
                  height={height}
                  width={width}
                  itemData={{
                    items,
                    rowRender,
                    isItemLoaded,
                    customLoader,
                    rowHeight,
                  }}
                  itemCount={itemCount}
                  itemSize={rowHeight}
                  onItemsRendered={onItemsRendered}
                  {...otherProps}
                >
                  {Item}
                </List>
              )
            }
          </InfiniteLoader>
        )}
      </AutoSizer>
    )
  },
)

InfiniteList.defaultProps = {
  loadMoreItems: () => {},
  customLoader: () => 'Loading...',
  rowHeight: 56,
  expandableHeight: 240,
  isExpandable: false,
}

InfiniteList.propTypes = {
  /** The items to display. */
  items: propTypes.array.isRequired,
  /** The total items counts. */
  totalItems: propTypes.number.isRequired,
  /** The row height in pixel. */
  rowHeight: propTypes.number.isRequired,
  /** Render function for row. The function gets the current item as first param. */
  rowRender: propTypes.func.isRequired,
  /** Function for custom loader when reach bottom. */
  customLoader: propTypes.func,
  /** Callback to be invoked when more rows must be loaded. */
  loadMoreItems: propTypes.func,
  /** True when fetching data. */
  isLoading: propTypes.bool,
  /** For css customization. */
  className: propTypes.string,
  /** Dictionary of the items that are expanded or not. */
  expandableRowMap: propTypes.object,
  /** Expandable element height . */
  expandableHeight: propTypes.number,
  /** Make each row expandable, if True -> Render different List */
  isExpandable: propTypes.bool,
}

export default InfiniteList
