import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { findAllByTestId, queryAllByTestId, screen } from '@testing-library/dom'
import keymap from '../../utils/enums/keymap'
import ChipsInput from './ChipsInput'

const changeInput = value => {
  const input = screen.getByRole('textbox')
  fireEvent.change(input, { target: { value } })
  return input
}

const addFreeTextChip = value => {
  const input = changeInput(value)
  fireEvent.keyDown(input, { keyCode: keymap.ENTER })
}

describe('<ChipsInput />', () => {
  describe('chips creation', () => {
    it('should create unique free text chip', () => {
      const { getAllByText } = render(<ChipsInput />)
      addFreeTextChip('mockData')
      addFreeTextChip('mockData')
      const chips = getAllByText('mockData')
      expect(chips).toHaveLength(1)
    })

    it('should fire onChange and onSubmit with relevant data when chip created', () => {
      const onChange = jest.fn()
      const onSubmit = jest.fn()
      render(<ChipsInput onChange={ onChange } onSubmit={ onSubmit } />)
      addFreeTextChip('mockData')
      addFreeTextChip('mockData2')
      // 3 because onChange fire on first render
      expect(onChange).toBeCalledTimes(3)
      expect(onSubmit).toBeCalledTimes(2)
      expect(onChange.mock.calls[2][0]).toEqual( [ 'mockData', 'mockData2'] )
      expect(onSubmit.mock.calls[1][0]).toEqual( [ 'mockData', 'mockData2'] )
    })

    it('should fire onInputChange with relevant data when chip created', () => {
      const onInputChange = jest.fn()
      render(<ChipsInput onInputChange={ onInputChange } />)
      changeInput('a')
      changeInput('b')
      // 3 because onInputChange fire on first render + add & clear for each submit
      expect(onInputChange).toBeCalledTimes(3)
      expect(onInputChange.mock.calls[1][0]).toEqual( 'a' )
      expect(onInputChange.mock.calls[2][0]).toEqual( 'b' )
    })

    it('should fire renderChipIcon when submitting a chip', () => {
      const renderChipIcon = jest.fn()
      render(<ChipsInput renderChipIcon={ renderChipIcon } />)
      addFreeTextChip('mockData')
      addFreeTextChip('mockData2')
      expect(renderChipIcon).toBeCalledTimes(2)
      expect(renderChipIcon.mock.calls[0][0]).toEqual( { "icon": undefined, "label": "mockData" })
      expect(renderChipIcon.mock.calls[1][0]).toEqual( { "icon": undefined, "label": "mockData2" })
    })
  })

  describe('chips deletion', () => {
    it('should delete chip by leading icon', () => {
      const onChange = jest.fn()
      const { getAllByRole, queryAllByTestId } = render(<ChipsInput onChange={ onChange }/>)
      addFreeTextChip('mockData')
      const buttons = getAllByRole('button')
      fireEvent.click(buttons[2])
      expect(onChange.mock.calls[2][0]).toEqual([])
      const chips = queryAllByTestId('chip')
      expect(chips.length).toEqual(0)
    })

    it('should delete all chips', () => {
      const onChange = jest.fn()
      const { getByLabelText, queryAllByTestId } = render(<ChipsInput onChange={ onChange }/>)
      addFreeTextChip('mockData')
      addFreeTextChip('mockData1')
      const removeAllButton = getByLabelText('remove all')
      fireEvent.click(removeAllButton)
      expect(onChange.mock.calls[3][0]).toEqual([])
      const chips = queryAllByTestId('chip')
      expect(chips.length).toEqual(0)
    })
  })

  describe('keys navigation', () => {
    it('should remove chip when BACKSPACE', () => {
      const onChange = jest.fn()
      const { getByRole, queryAllByTestId } = render(<ChipsInput onChange={ onChange } />)
      const input = getByRole('textbox')
      addFreeTextChip('mockData')
      addFreeTextChip('mockData2')
      fireEvent.keyDown(input, { keyCode: keymap.BACKSPACE })
      fireEvent.keyDown(input, { keyCode: keymap.BACKSPACE })
      expect(onChange.mock.calls[4][0]).toEqual([])
      const chips = queryAllByTestId('chip')
      expect(chips.length).toEqual(0)
    })

    it('should remove chip when DELETE', () => {
      const onChange = jest.fn()
      const { getAllByTestId, queryAllByTestId } = render(<ChipsInput onChange={ onChange } />)
      addFreeTextChip('mockData')
      addFreeTextChip('mockData2')
      const chips = getAllByTestId('chip')
      const [firstChip, secondChip] = chips
      fireEvent.click(firstChip)
      fireEvent.keyDown(firstChip, { keyCode: keymap.DELETE })
      fireEvent.keyDown(firstChip, { keyCode: keymap.DELETE })
      expect(onChange.mock.calls[4][0]).toEqual([])
      const deletedChips = queryAllByTestId('chip')
      expect(deletedChips.length).toEqual(0)
    })

    it('should arrow left/right should focus chips', () => {
      const onFocusChange = jest.fn()
      const { getByRole, getAllByTestId } = render(<ChipsInput onFocusChange={ onFocusChange }/>)
      const input = getByRole('textbox')
      addFreeTextChip('mockData')
      addFreeTextChip('mockData2')
      fireEvent.keyDown(input, { keyCode: keymap.ARROW_LEFT })
      const chips = getAllByTestId('chip')
      const [firstChip,secondChip] = chips
      expect(document.activeElement).toBe(secondChip)
      fireEvent.keyDown(input, { keyCode: keymap.ARROW_LEFT })
      expect(document.activeElement).toBe(firstChip)
      fireEvent.keyDown(input, { keyCode: keymap.ARROW_LEFT })
      expect(document.activeElement).toBe(firstChip)
      fireEvent.keyDown(input, { keyCode: keymap.ARROW_RIGHT })
      expect(document.activeElement).toBe(secondChip)
      fireEvent.keyDown(input, { keyCode: keymap.ARROW_RIGHT })
      expect(document.activeElement).toBe(input)
      // Should be invoked once on mount and for each time focus entered and left the input
      expect(onFocusChange).toBeCalledTimes(3)
    })
  })
})
