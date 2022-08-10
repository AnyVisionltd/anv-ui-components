import React, { useState } from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import UserEvents from '@testing-library/user-event'
import DynamicFilter from '../../DynamicFilter'

const title = 'ListFilter'
const applyLabel = 'Apply'
const cancelTestId = 'onCancel-btn'
const dynamicFilterMenuContainerTestId = 'dynamic-filter-container'
const filterDropdownTestId = 'menu-select'
const searchFilterInputTestId = 'search-filter-input'
const selectAllTestId = 'select-all-container'
const infinityListTestId = 'infinity-list'
const listItemTestId = 'list-item'
const mockListItems = [
  { id: 'subject 1', value: 'subject 1', type: 'Face' },
  { id: 'subject 2', value: 'subject 2', type: 'Body' },
  { id: 'subject 3', value: 'subject 3', type: 'Body' },
  { id: 'subject 4', value: 'subject 4', type: 'Face' },
  { id: 'subject 5', value: 'subject 5', type: 'Body' },
  { id: 'subject 6', value: 'subject 6', type: 'Body' },
  { id: 'subject 7', value: 'subject 7', type: 'Face' },
  { id: 'subject 8', value: 'subject 8', type: 'Face' },
  { id: 'subject 9', value: 'subject 9', type: 'Face' },
  { id: 'subject 10', value: 'subject 10', type: 'Face' },
  { id: 'subject 11', value: 'subject 11', type: 'Body' },
  { id: 'subject 12', value: 'subject 12', type: 'Body' },
  { id: 'subject 13', value: 'subject 13', type: 'Body' },
  { id: 'subject 14', value: 'subject 14', type: 'Face' },
  { id: 'subject 15', value: 'subject 15', type: 'Person' },
  { id: 'subject 16', value: 'subject 16', type: 'Person' },
  { id: 'subject 17', value: 'subject 17', type: 'Face' },
  { id: 'subject 18', value: 'subject 18', type: 'Person' },
]
const loadDataOffset = 10
const mockListFilterItems = [
  {
    id: 'Face',
    value: 'Face',
  },
  {
    id: 'Body',
    value: 'Body',
  },
  {
    id: 'Person',
    value: 'Person',
  },
]

const onApply = jest.fn()
const onClose = jest.fn()
const onChange = jest.fn()

jest.mock('react-virtualized-auto-sizer', () => ({ children }) =>
  children({ height: 240, width: '100%' }),
)

const getFilteredItems = (itemsToFilter, search, selectFilter) => {
  return itemsToFilter.filter(
    item =>
      item.type === selectFilter.id &&
      item.value.toLowerCase().includes(search.toLowerCase()),
  )
}

const RenderComp = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [searchFilter, setSearchFilter] = useState('')
  const [listFilter, setListFilter] = useState(mockListFilterItems[0])
  const [itemsToShow, setItemsToShow] = useState(
    getFilteredItems(mockListItems, searchFilter, listFilter).slice(
      0,
      loadDataOffset,
    ),
  )

  const onLoadMoreData = () => {
    setIsLoading(true)
    setItemsToShow(prev => {
      const filteredItems = getFilteredItems(
        mockListItems,
        searchFilter,
        listFilter,
      )
      return filteredItems.slice(0, prev.length + loadDataOffset)
    })
    setIsLoading(false)
  }

  return (
    <DynamicFilter title={title} onApply={onApply} onClose={onClose}>
      <DynamicFilter.ListFilter
        elementKey={title}
        items={itemsToShow}
        onLoadMoreData={onLoadMoreData}
        unControlled={true}
        onChange={onChange}
        totalItems={mockListItems.length}
        isLoading={isLoading}
        filterItems={mockListFilterItems}
      />
    </DynamicFilter>
  )
}

describe('Test the DynamicFilterListFilter Component', () => {
  beforeEach(() => {
    render(<RenderComp />)
  })
  afterEach(cleanup)

  test('check that main title exists', () => {
    const mainBtnEl = screen.queryByText(title)
    expect(mainBtnEl).toBeInTheDocument()
  })

  test('check that all list items exists', () => {
    const mainBtnEl = screen.queryByText(title)
    if (mainBtnEl) {
      UserEvents.click(mainBtnEl)
      const filterDropdownEl = screen.queryByTestId(filterDropdownTestId)
      const searchFilterEl = screen.queryByTestId(searchFilterInputTestId)
      const selectAllEl = screen.queryByTestId(selectAllTestId)
      const infinityListEl = screen.queryByTestId(infinityListTestId)
      expect(filterDropdownEl).toBeInTheDocument()
      expect(searchFilterEl).toBeInTheDocument()
      expect(selectAllEl).toBeInTheDocument()
      expect(infinityListEl).toBeInTheDocument()
    }
  })

  test('check that search input got the right value', () => {
    const mainBtnEl = screen.queryByText(title)
    if (mainBtnEl) {
      UserEvents.click(mainBtnEl)
      const searchFilterEl = screen.queryByTestId(
        searchFilterInputTestId,
      ) as HTMLInputElement
      if (searchFilterEl) {
        UserEvents.type(searchFilterEl, 'subject')
        expect(searchFilterEl.value).toBe('subject')
      }
    }
  })

  test('check that only the filtered items exists.', () => {
    const mainBtnEl = screen.queryByText(title)
    const expectedItemsCount = mockListItems.filter(
      item => item.type === mockListFilterItems[0].id,
    ).length
    if (mainBtnEl) {
      UserEvents.click(mainBtnEl)
      const listItemsElements = screen.getAllByTestId(listItemTestId)
      expect(listItemsElements).toHaveLength(expectedItemsCount)
    }
  })

  test('check that onChange have the expected result.', () => {
    const mainBtnEl = screen.queryByText(title)
    const searchValue = 'subject 1'
    const expectedValue = {
      search: searchValue,
      selectFilter: mockListFilterItems[0],
      isExcludeMode: false
    }
    if (mainBtnEl) {
      UserEvents.click(mainBtnEl)
      const searchFilterEl = screen.queryByTestId(searchFilterInputTestId)
      if (searchFilterEl) {
        UserEvents.type(searchFilterEl, searchValue)
        expect(onChange).toHaveBeenCalledWith(expectedValue)
      }
    }
  })

  test('check that onApply have the expected result', () => {
    const mainBtnEl = screen.queryByText(title)
    const expectedValue = {
      [title]: {
        isExcludeMode: false,
        selectedItems: [],
      },
    }
    if (mainBtnEl) {
      UserEvents.click(mainBtnEl)
      const applyBtn = screen.queryByText(applyLabel)
      if (applyBtn) {
        UserEvents.click(applyBtn)
        expect(onApply).toHaveBeenCalledWith(expectedValue)
      }
    }
  })

  test('check that onClose close the menu', () => {
    const mainBtnEl = screen.queryByText(title)
    if (mainBtnEl) {
      UserEvents.click(mainBtnEl)
      const closeBtn = screen.getByTestId(cancelTestId)
      if (closeBtn) {
        UserEvents.click(closeBtn)
        const menuContainerEl = screen.queryByTestId(
          dynamicFilterMenuContainerTestId,
        )
        expect(onClose).toHaveBeenCalledWith()
        expect(menuContainerEl).toBeNull()
      }
    }
  })
})
