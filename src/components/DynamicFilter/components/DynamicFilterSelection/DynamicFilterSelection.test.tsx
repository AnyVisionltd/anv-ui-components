import React from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import UserEvents from '@testing-library/user-event'
import DynamicFilter from '../../DynamicFilter'
import { SortItemInterface } from '../../utils'

const selectionItems: Array<SortItemInterface> = [
  { id: 'name', value: 'name' },
  { id: 'type', value: 'type' },
]

const title = 'Selection'
const applyLabel = 'Apply'
const cancelTestId = 'onCancel-btn'
const dynamicFilterMenuContainerTestId = 'dynamic-filter-container'

const onApply = jest.fn()
const onClose = jest.fn()

const RenderComp = () => (
  <DynamicFilter title={title} onApply={onApply} onClose={onClose}>
    <DynamicFilter.Selection items={selectionItems} elementKey={title} />
  </DynamicFilter>
)

describe('Test the DynamicFilterSelection Component', () => {
  beforeEach(() => {
    render(<RenderComp />)
  })
  afterEach(cleanup)

  test('check that main title exists', () => {
    const mainBtnEl = screen.queryByText(title)
    expect(mainBtnEl).toBeInTheDocument()
  })

  test('check that all selection items exists', () => {
    const mainBtnEl = screen.queryByText(title)
    if (mainBtnEl) {
      UserEvents.click(mainBtnEl)
      selectionItems.forEach(selectionItem => {
        const selectionItemEl = screen.queryByText(selectionItem.value)
        expect(selectionItemEl).toBeInTheDocument()
      })
    }
  })

  test('should be changed true after clicking on the checkbox item', () => {
    const mainBtnEl = screen.queryByText(title)
    if (mainBtnEl) {
      UserEvents.click(mainBtnEl)
      selectionItems.forEach(selectionItem => {
        const selectionCheckboxItemEl = screen.getByTestId(
          selectionItem.id,
        ) as HTMLInputElement
        if (selectionCheckboxItemEl) {
          UserEvents.click(selectionCheckboxItemEl)
          expect(selectionCheckboxItemEl.checked).toBe(true)
        }
      })
    }
  })

  test('check that the default checked is the first selection item', () => {
    const mainBtnEl = screen.queryByText(title)
    if (mainBtnEl) {
      UserEvents.click(mainBtnEl)
      const firstSelectionCheckboxItemEl = screen.getByTestId(
        selectionItems[0].id,
      ) as HTMLInputElement
      if (firstSelectionCheckboxItemEl) {
        expect(firstSelectionCheckboxItemEl.checked).toBe(true)
      }
    }
  })

  test('check that onApply have the expected result', () => {
    const mainBtnEl = screen.queryByText(title)
    const expectedValue = {
      [title]: {
        selectedItemId: selectionItems[0].id,
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
