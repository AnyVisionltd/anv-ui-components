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
  const [isLoading, setIsLoading] = useState(false)

  const totalItems = 50

  const loadMoreItems = useCallback(() => {
    setIsLoading(true)
    setTimeout(() => {
      const newItems = [...items, ...Array(10).keys()]
      setItems(newItems)
      setIsLoading(false)
    }, 2500)
  }, [items])


  const rowRender = item => {
    return <div style={ { height: '56px' } }> item { item }</div>
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
        isLoading={ isLoading }
      />
    </div>
  )
}
