import React, { useState, useCallback } from 'react'
import { InfiniteList } from '../../index'
import { centerDecorator } from "../../utils/storybook/decorators"

export default {
  title: 'Components/InfiniteList',
  component: InfiniteList,
  decorators: [centerDecorator],
}

export const Default = () => {
  const [items, setItems] = useState([])
  const [isNextPageLoading, setIsNextPageLoading] = useState(false)

  const totalItems = 50

  const loadMoreItems = useCallback(() => {
    setIsNextPageLoading(true)
    setTimeout(() => {
      const newItems = [...items, ...Array(10).fill('item')]
      setItems(newItems)
      setIsNextPageLoading(false)
    }, 2000)
  }, [items])


  const rowRender = item => {
    return <div style={ { height: '56px' } }> { item } 1 </div>
  }

  const loaderRender = () => 'Fetching data...'

  return (
    <div style={ { width: '80%', height: '300px' } }>
      <InfiniteList
        items={ items }
        itemsCount={ totalItems }
        rowRender={ rowRender }
        loaderRender={ loaderRender }
        loadMoreItems={ loadMoreItems }
        isNextPageLoading={ isNextPageLoading }
      />
    </div>
  )
}
