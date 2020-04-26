import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { ReactComponent as SvgIcon } from '../../../jest/assets/svgIcon.svg'
import Chip from './Chip'

const chipText = 'Chip text'
describe('<Chip />', () => {
  it('should fire click handler if \'onClick\' prop is set', () => {
    const handleClick = jest.fn()
    const { getByRole } = render(
      <Chip
        label={ chipText }
        onClick={ handleClick }
      />,
    )
    const node = getByRole('button')
    fireEvent.click(node)
    expect(handleClick).toBeCalled()
  })

  it('should not be clickable when disabled', () => {
    const handleClick = jest.fn()
    const { getByRole } = render(
      <Chip
        label={ chipText }
        disabled
        onClick={ handleClick }
      />,
    )
    const node = getByRole('button')
    fireEvent.click(node)
    expect(handleClick).not.toBeCalled()
  })

  it('should be clickable by pressing return key while focused', () => {
    const handleClick = jest.fn()
    const { getByRole } = render(
      <Chip
        label={ chipText }
        onClick={ handleClick }
      />,
    )
    const node = getByRole('button')
    fireEvent.focus(node)
    fireEvent.keyUp(node, { key: 'Enter' })
    expect(handleClick).toBeCalled()
  })

  it('should call \'on trailing icon click\' when set as deletable and pressed on backspace key while focused', () => {
    const handleClick = jest.fn()
    const { getAllByRole } = render(
      <Chip
        label={ chipText }
        deletable
        onTrailingIconClick={ handleClick }
      />,
    )
    const [node] = getAllByRole('button')
    fireEvent.focus(node)
    fireEvent.keyUp(node, { key: 'Backspace' })
    expect(handleClick).toBeCalled()
  })

  it('should call \'on trailing icon click\' when set as deletable and pressed on delete key while focused', () => {
    const handleClick = jest.fn()
    const { getAllByRole } = render(
      <Chip
        label={ chipText }
        deletable
        onTrailingIconClick={ handleClick }
      />,
    )
    const [node] = getAllByRole('button')
    fireEvent.focus(node)
    fireEvent.keyUp(node, { key: 'Delete' })
    expect(handleClick).toBeCalled()
  })

  it('should call \'on trailing icon click\' when trailing icon is clicked', () => {
    const handleClick = jest.fn()
    const { getAllByRole } = render(
      <Chip
        label={ chipText }
        onTrailingIconClick={ handleClick }
        trailingIcon={ <SvgIcon /> }
      />,
    )
    const [, node] = getAllByRole('button')
    fireEvent.click(node)
    expect(handleClick).toBeCalled()
  })
})
