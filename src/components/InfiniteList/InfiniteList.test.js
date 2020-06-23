import React from 'react'
import { render } from '@testing-library/react'
import InfiniteList from './InfiniteList'
import mockAutoSizer from '../../testUtils/mockAutoSizer'

const items = [...Array(10).keys()]
const totalItems = 20

const rowRender = item => {
  return <div data-testid={ 'list-item' } style={ { height: '56px' } }> item { item }</div>
}

jest.mock(
  'react-virtualized-auto-sizer',
  ()=> jest.fn()
)

describe('<InfiniteList />', () => {

  beforeAll(() => {
    mockAutoSizer.size(56)
  })
  afterAll(() => {
    mockAutoSizer.restore()
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

  it('should render default loading', () => {
    const { getByText } = render((
      <InfiniteList
		  items={ [] }
		  rowRender={ rowRender }
		  totalItems={ totalItems }
		  isLoading={ true }
      />
	  )
    )
    getByText('Loading...')
  })

  it('should render custom loading', () => {
    const { getByText } = render((
      <InfiniteList
		  items={ [] }
		  rowRender={ rowRender }
		  totalItems={ totalItems }
		  isLoading={ true }
		  customLoader={ () => <div>custom loader</div> }
      />
	  )
    )
    getByText('custom loader')
  })
})
