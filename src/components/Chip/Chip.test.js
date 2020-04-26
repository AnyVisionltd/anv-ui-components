import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { ReactComponent as SvgIcon } from '../../../jest/assets/svgIcon.svg'
import Chip from './Chip'

const chipText = 'Chip text'
describe('<Chip />', () => {
  describe('Element rendering', () => {
    it('should render the chip using the correct label', () => {
      const { getByText } = render(<Chip label={ chipText } />)
      const node = getByText('Chip text')
      expect(node.innerHTML).toBe(chipText)
    })

    it('should not render any icons by default', () => {
      const { container } = render(<Chip label={ chipText } />)
      const node = container.querySelector('svg')
      expect(node).toBeFalsy()
    })

    it('should render a leading icon', () => {
      const { container } = render(
        <Chip
          label={ chipText }
          leadingIcon={ <SvgIcon /> }
        />,
      )
      const node = container.querySelector('svg')
      expect(node).toBeTruthy()
    })

    it('should render a trailing icon', () => {
      const { container } = render(
        <Chip
          label={ chipText }
          trailingIcon={ <SvgIcon /> }
        />,
      )
      const node = container.querySelector('svg')
      expect(node).toBeTruthy()
    })

    it('should render a close icon by default when trailing icon click handler is enabled, and deletable true', () => {
      const { container } = render(
        <Chip
          label={ chipText }
          deletable
          onTrailingIconClick={ () => {
          } }
        />,
      )
      const node = container.querySelector('svg')
      expect(node).toBeTruthy()
    })

    it('should render as disabled when passing \'disabled\' prop', () => {
      const { container } = render(
        <Chip
          label={ chipText }
          disabled
        />,
      )
      const node = container.querySelector('div')
      expect(node.classList).toContain('disabled')
    })
  })

  describe('Events handling', () => {
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
})
