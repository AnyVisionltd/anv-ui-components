import React from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import UserEvents from '@testing-library/user-event'
import DynamicFilter from '../../DynamicFilter'
import { SortItemInterface } from '../../utils'

const sortItems: Array<SortItemInterface> = [
  { id: 'name', value: 'name' },
  { id: 'type', value: 'type' },
]

const title = 'Sort'
const applyLabel = 'Apply'
const cancelTestId = 'onCancel-btn'
const dynamicFilterMenuContainerTestId = 'dynamic-filter-container'

const onApply = jest.fn()
const onClose = jest.fn()

const RenderComp = () => (
  <DynamicFilter title={title} onApply={onApply} onClose={onClose}>
    <DynamicFilter.Sort items={sortItems} elementKey={title} />
  </DynamicFilter>
)

describe('Test the DynamicFilterSort Component', () => {
  beforeEach(() => {
    render(<RenderComp />)
  })
  afterEach(cleanup)

  test('check that main title exists', () => {
    const mainBtnEl = screen.queryByText(title)
    expect(mainBtnEl).toBeInTheDocument()
  })

  test('check that all sort items exists', () => {
    const mainBtnEl = screen.queryByText(title)
    if (mainBtnEl) {
      UserEvents.click(mainBtnEl)
      sortItems.forEach(sortItem => {
        const sortItemEl = screen.queryByText(sortItem.value)
        expect(sortItemEl).toBeInTheDocument()
      })
    }
  })

  test('should be changed true after clicking on the checkbox item', () => {
    const mainBtnEl = screen.queryByText(title)
    if (mainBtnEl) {
      UserEvents.click(mainBtnEl)
      sortItems.forEach(sortItem => {
        const sortCheckboxItemEl = screen.getByTestId(sortItem.id)
        if (sortCheckboxItemEl) {
          UserEvents.click(sortCheckboxItemEl)
          expect(sortCheckboxItemEl.checked).toBe(true)
        }
      })
    }
  })

  test('check that the default checked is the first sort item', () => {
    const mainBtnEl = screen.queryByText(title)
    if (mainBtnEl) {
      UserEvents.click(mainBtnEl)
      const firstSortCheckboxItemEl = screen.getByTestId(sortItems[0].id)
      if (firstSortCheckboxItemEl) {
        expect(firstSortCheckboxItemEl.checked).toBe(true)
      }
    }
  })

  test('check that onApply have the expected result', () => {
    const mainBtnEl = screen.queryByText(title)
    const expectedValue = {
      [title]: {
        selectedItemId: sortItems[0].id,
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
