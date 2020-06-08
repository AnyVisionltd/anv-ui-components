import React from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import { FixedSizeList as List } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'
import AutoSizer from 'react-virtualized-auto-sizer'
import styles from './InfiniteList.module.scss'

const InfiniteList = ({
  rowRender,
  loaderRender,
  itemsCount,
  items,
  loadMoreItems,
  className
}) => {

  const hasNextPage = items.length < itemsCount

  const itemCount = hasNextPage ? items.length + 1 : items.length

  const isItemLoaded = index => !hasNextPage || index < items.length

  const Item = ({ index, style }) => {
    let content
    if (!isItemLoaded(index)) {
      content = loaderRender()
    } else {
      content = rowRender(items[index])
    }

    return <div style={ style }>{ content }</div>
  }

  const classes = classNames(
    styles.infiniteList,
    className
  )

  return (
    <InfiniteLoader
      isItemLoaded={ isItemLoaded }
      itemCount={ itemCount }
      loadMoreItems={ loadMoreItems }
    >
      { ({ onItemsRendered, ref }) => (
        <AutoSizer>
          { ({ height, width }) => (
            <List
              className={ classes }
              height={ height }
              width={ width }
              itemCount={ itemCount }
              itemSize={ 56 }
              onItemsRendered={ onItemsRendered }
              ref={ ref }
            >
              { Item }
            </List>
          ) }
        </AutoSizer>
      ) }
    </InfiniteLoader>
  )
}

InfiniteList.defaultProps = {
  loaderRender: () => 'Loading...'
}

InfiniteList.propTypes = {
  /** The items to display. */
  items: propTypes.array.isRequired,
  /** The total items counts. */
  itemsCount: propTypes.number.isRequired,
  /** Render function for row. The function gets the current item as first param. */
  rowRender: propTypes.func.isRequired,
  /** Function for custom loader when reach bottom. */
  loaderRender: propTypes.func,
  /** Callback fire when almost reach to the list bottom, use for fetch more data and update <code>items</code>. */
  loadMoreItems: propTypes.func,
  /** For css customization. */
  className: propTypes.string
}

export default InfiniteList
