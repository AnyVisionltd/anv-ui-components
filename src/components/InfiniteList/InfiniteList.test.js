import React from 'react'
import { render } from '@testing-library/react'
import InfiniteList from './InfiniteList'

const items = [...Array(10).keys()]
const totalItems = 20

const rowRender = item => {
  return <div data-testid={ 'list-item' } style={ { height: '56px' } }> item { item }</div>
}

describe('<InfiniteList />', () => {
  const originalOffsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight')
  const originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth')

  beforeAll(() => {
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { configurable: true, value: 56 })
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, value: 56 })
  })

  afterAll(() => {
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', originalOffsetHeight)
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', originalOffsetWidth)
  })

  it('should render 3 rows', () => {
    const { getAllByTestId, getByText } = render((
      <InfiniteList
		  items={ items }
		  rowRender={ rowRender }
		  totalItems={ totalItems }/>
	  )
    )
    getByText('item 0')
    const listItems = getAllByTestId('list-item')

    // render the one item + two more for scroll
    expect(listItems).toHaveLength(3)


  })
})
