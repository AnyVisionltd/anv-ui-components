import React from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import { FixedSizeList as List } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'
import AutoSizer from 'react-virtualized-auto-sizer'
import styles from './InfiniteList.module.scss'

const InfiniteList = ({
  rowRender,
  customLoader,
  rowHeight,
  totalItems,
  items,
  loadMoreItems,
  isLoading,
  className
}) => {

  const hasNextPage = items.length < totalItems

  const itemCount = hasNextPage ? items.length + 1 : items.length

  const loadMore = isLoading ? () => {} : loadMoreItems

  // Every row is loaded except for our loading indicator row.
  const isItemLoaded = index => !hasNextPage || index < items.length

  const Item = ({ index, style }) => {
    let content
    if (!isItemLoaded(index)) {
      content = customLoader()
    } else {
      content = rowRender(items[index], index)
    }

    return <div style={ style }>{ content }</div>
  }

  const classes = classNames(
    styles.infiniteList,
    className
  )

  return (
    <AutoSizer>
      { ({ height, width }) => (
        <InfiniteLoader
          isItemLoaded={ isItemLoaded }
          itemCount={ itemCount }
          loadMoreItems={ loadMore }
          threshold={ 0 }
        >
          { ({ onItemsRendered, ref }) => (
            <List
              ref={ ref }
              className={ classes }
              height={ height }
              width={ width }
              itemCount={ itemCount }
              itemSize={ rowHeight }
              onItemsRendered={ onItemsRendered }
            >
              { Item }
            </List>
          ) }
        </InfiniteLoader>
      ) }
    </AutoSizer>
  )
}

InfiniteList.defaultProps = {
  loadMoreItems: () => {},
  customLoader: () => 'Loading...',
  rowHeight: 56
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
  className: propTypes.string
}

export default InfiniteList
