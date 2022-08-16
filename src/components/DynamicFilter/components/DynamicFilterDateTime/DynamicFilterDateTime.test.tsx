import { cleanup, render, screen } from '@testing-library/react'
import UserEvents from '@testing-library/user-event'
import DynamicFilter from '../../DynamicFilter'

const title = 'DateTime'
const DateTimeTitle = 'Event Timestamp'
const applyLabel = 'Apply'
const cancelTestId = 'onCancel-btn'
const dynamicFilterMenuContainerTestId = 'dynamic-filter-container'
const durationTitle = 'During the Last'
const timeTitle = 'Specific Time'
const durationInputTestId = 'duration-input'
const menuSelectTestId = 'menu-select'
const datePickerFromTestId = 'from-date-picker'
const datePickerToTestId = 'to-date-picker'
const mockDefaultFromValue = '2022-07-17T10:43:55.641Z'
const mockDefaultToValue = '2022-07-19T10:43:55.642Z'

const onApply = jest.fn()
const onClose = jest.fn()

const RenderComp = () => (
  <DynamicFilter title={title} onApply={onApply} onClose={onClose}>
    <DynamicFilter.DateTime
      elementKey={title}
      title={DateTimeTitle}
      from={mockDefaultFromValue}
      to={mockDefaultToValue}
    />
  </DynamicFilter>
)

describe('Test the DynamicFilterDateTime Component', () => {
  beforeEach(() => {
    render(<RenderComp />)
  })
  afterEach(cleanup)

  test('check that main title exists', () => {
    const mainBtnEl = screen.queryByText(title)
    expect(mainBtnEl).toBeInTheDocument()
  })

  test('check that all DateTime items exists', () => {
    const mainBtnEl = screen.queryByText(title)
    if (mainBtnEl) {
      UserEvents.click(mainBtnEl)
      const titleEl = screen.queryByText(DateTimeTitle)
      const durationTitleEl = screen.queryByText(durationTitle)
      const timeTitleEl = screen.queryByText(timeTitle)
      const durationInputEl = screen.queryByTestId(durationInputTestId)
      const durationSelectEl = screen.queryByTestId(menuSelectTestId)
      const datePickerFromEl = screen.queryByTestId(datePickerFromTestId)
      const datePickerToEl = screen.queryByTestId(datePickerToTestId)
      expect(titleEl).toBeInTheDocument()
      expect(durationTitleEl).toBeInTheDocument()
      expect(timeTitleEl).toBeInTheDocument()
      expect(durationInputEl).toBeInTheDocument()
      expect(durationSelectEl).toBeInTheDocument()
      expect(datePickerFromEl).toBeInTheDocument()
      expect(datePickerToEl).toBeInTheDocument()
    }
  })

  test('check that certain elements are disabled', () => {
    const mainBtnEl = screen.queryByText(title)
    if (mainBtnEl) {
      UserEvents.click(mainBtnEl)
      const datePickerFromEl = screen.queryByTestId(datePickerFromTestId)
      const datePickerToEl = screen.queryByTestId(datePickerToTestId)
      expect(datePickerFromEl).toBeDisabled()
      expect(datePickerToEl).toBeDisabled()
    }
  })

  test('check that onApply have the expected result', () => {
    const mainBtnEl = screen.queryByText(title)
    const expectedValue = {
      [title]: {
        selectedTime: {
          from: mockDefaultFromValue,
          to: mockDefaultToValue,
        },
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
