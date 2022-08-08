import React from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import UserEvents from '@testing-library/user-event'
import DynamicFilter from '../../DynamicFilter'

const title = 'SingleSlider'
const titleLabel = 'Score'
const applyLabel = 'Apply'
const cancelTestId = 'onCancel-btn'
const dynamicFilterMenuContainerTestId = 'dynamic-filter-container'
const rangeSliderWithInputsTestId = 'range-slider-with-inputs'
const sliderDualInputTestId = 'slider-dual-input'
const sliderSingleInputTestId = 'slider-single-input'
const mockDefaultValue = 50
const mockDefaultDualValue = [4, 8]

const onApply = jest.fn()
const onClose = jest.fn()

const RenderSingleSlider = () => (
  <DynamicFilter title={title} onApply={onApply} onClose={onClose}>
    <DynamicFilter.Slider
      elementKey={title}
      title={titleLabel}
      defaultValue={mockDefaultValue}
    />
  </DynamicFilter>
)

const RenderDualSlider = () => (
  <DynamicFilter title={title} onApply={onApply} onClose={onClose}>
    <DynamicFilter.Slider
      elementKey={title}
      title={titleLabel}
      defaultValue={mockDefaultDualValue}
      min={0}
      max={10}
    />
  </DynamicFilter>
)

describe('Test the DynamicFilterSlider singleSlider', () => {
  beforeEach(() => {
    render(<RenderSingleSlider />)
  })
  afterEach(cleanup)

  test('check that all slider elements exists', () => {
    const mainBtnEl = screen.queryByText(title)
    if (mainBtnEl) {
      UserEvents.click(mainBtnEl)
      const titleEl = screen.queryByText(titleLabel)
      const sliderEl = screen.queryByTestId(rangeSliderWithInputsTestId)
      const inputEl = screen.queryByTestId(sliderSingleInputTestId)
      expect(titleEl).toBeInTheDocument()
      expect(sliderEl).toBeInTheDocument()
      expect(inputEl).toBeInTheDocument()
    }
  })

  test('check that input got the right value', () => {
    const mainBtnEl = screen.queryByText(title)
    if (mainBtnEl) {
      UserEvents.click(mainBtnEl)
      const inputEl = screen.queryByTestId(
        sliderSingleInputTestId,
      ) as HTMLInputElement
      if (inputEl) {
        expect(Number(inputEl.value)).toBe(mockDefaultValue)
      }
    }
  })

  test('check that onApply have the expected result', () => {
    const mainBtnEl = screen.queryByText(title)
    const expectedValue = {
      [title]: {
        selectedRange: mockDefaultValue,
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
})

describe('Test the DynamicFilterSlider dualSlider', () => {
  beforeEach(() => {
    render(<RenderDualSlider />)
  })
  afterEach(cleanup)

  test('check that all slider elements exists', () => {
    const mainBtnEl = screen.queryByText(title)
    if (mainBtnEl) {
      UserEvents.click(mainBtnEl)
      const titleEl = screen.queryByText(titleLabel)
      const sliderElements = screen.queryAllByTestId(
        rangeSliderWithInputsTestId,
      )
      const inputElements = screen.queryAllByTestId(sliderDualInputTestId)
      expect(titleEl).toBeInTheDocument()
      expect(sliderElements).toHaveLength(2)
      expect(inputElements).toHaveLength(2)
    }
  })

  test('check that all the inputs got the right value', () => {
    const mainBtnEl = screen.queryByText(title)
    if (mainBtnEl) {
      UserEvents.click(mainBtnEl)
      const inputElements = screen.queryAllByTestId(
        sliderDualInputTestId,
      ) as HTMLInputElement[]
      if (inputElements.length) {
        inputElements.forEach((inputEl, idx) => {
          expect(Number(inputEl.value)).toBe(mockDefaultDualValue[idx])
        })
      }
    }
  })

  test('check that onApply have the expected result', () => {
    const mainBtnEl = screen.queryByText(title)
    const expectedValue = {
      [title]: {
        selectedRange: mockDefaultDualValue,
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
})

describe('Test the DynamicFilterSlider Component', () => {
  beforeEach(() => {
    render(<RenderSingleSlider />)
  })
  afterEach(cleanup)

  test('check that main title exists', () => {
    const mainBtnEl = screen.queryByText(title)
    expect(mainBtnEl).toBeInTheDocument()
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
