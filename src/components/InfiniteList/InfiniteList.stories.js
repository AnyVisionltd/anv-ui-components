import React, { useState, useCallback, useRef } from 'react'
import { InfiniteList, Button } from '../../index'
import { centerDecorator } from '../../utils/storybook/decorators'

export default {
  title: 'Content/Lists/InfiniteList',
  component: InfiniteList,
  decorators: [centerDecorator],
}

export const Default = () => {
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const listRef = useRef()

  const scrollToTop = () => {
    listRef.current.scrollToItem(0)
  }

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
    return <div style={{ height: '56px' }}> item {item}</div>
  }

  const loaderRender = () => 'Fetching data...'

  return (
    <div style={{ width: '80%', height: '300px' }}>
      <Button
        size={'small'}
        style={{ marginLeft: 'auto' }}
        variant={'ghost'}
        onClick={scrollToTop}
      >
        scroll to top
      </Button>
      <InfiniteList
        ref={listRef}
        items={items}
        totalItems={totalItems}
        rowRender={rowRender}
        customLoader={loaderRender}
        loadMoreItems={loadMoreItems}
        isLoading={isLoading}
      />
    </div>
  )
}
