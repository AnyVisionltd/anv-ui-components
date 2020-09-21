import React from 'react'
import { Tooltip } from "."
import { render, fireEvent, act } from '@testing-library/react'

describe('<Tooltip/>', () => {
  describe('Hovering over anchor component', () => {

    beforeEach(() => {
      jest.useFakeTimers()
    })

    it('should display the tooltip when hovering over anchor element', async () => {
      const { getByText, queryByText } = render(
        <Tooltip content={ 'tooltip!' }>
          <button>button</button>
        </Tooltip>
      )

      await act(async () => {
        fireEvent.mouseEnter(getByText('button'))
        await jest.advanceTimersByTime(0) // wait for enter timeout
      })
      expect(queryByText('tooltip!')).toBeVisible()
    })

    it('should hide the tooltip when leaving anchor element', async () => {
      const { getByText, queryByText } = render(
        <Tooltip content={ 'tooltip!' }>
          <button>button</button>
        </Tooltip>
      )

      await act(async () => {
        fireEvent.mouseEnter(getByText('button'))
        fireEvent.mouseLeave(getByText('button'))
        await jest.advanceTimersByTime(0) // default leave tim is 0
      })
      expect(queryByText('tooltip!')).toBeNull()
    })

    it('should show the tooltip after defined custom enter time', async () => {
      const customEnterTime = 10000

      const { getByText, queryByText } = render(
        <Tooltip content={ 'tooltip!' }>
          <button>button</button>
        </Tooltip>
      )
      await act(async () => {
        fireEvent.mouseEnter(getByText('button'))
        expect(queryByText('tooltip!')).toBeNull()
        await jest.advanceTimersByTime(customEnterTime)
      })
      expect(queryByText('tooltip!')).toBeVisible()
    })

    it('should keep showing the tooltip for specified leave time and then hide it', async () => {
      const customLeaveTime = 10000

      const { getByText, queryByText } = render(
        <Tooltip content={ 'tooltip!' }>
          <button>button</button>
        </Tooltip>
      )

      await act(async () => {
        fireEvent.mouseEnter(getByText('button'))
        await  jest.advanceTimersByTime(0) // wait for tooltip to show
        expect(queryByText('tooltip!')).toBeVisible()
        fireEvent.mouseLeave(getByText('button'))
        await jest.advanceTimersByTime(customLeaveTime)
      })
      expect(queryByText('tooltip!')).toBeNull()
    })

    it('should keep tooltip showing while the mouse is hover anchor', async () => {
      const { getByText, queryByText } = render(
        <Tooltip content={ 'tooltip!' }>
          <button>button</button>
        </Tooltip>
      )

      await act(async () => {
        fireEvent.mouseEnter(getByText('button'))
        // wait longer than the default enter time (100) and leave time (500)
        jest.advanceTimersByTime(1000)
      })
      expect(queryByText('tooltip!')).toBeVisible()
    })

    it('should keep the tooltip visible when hovering over the tooltip', async () => {
      const { getByText, queryByText } = render(
        <Tooltip content={ 'tooltip!' }>
          <button>button</button>
        </Tooltip>
      )

      await act(async () => {
        fireEvent.mouseEnter(getByText('button'))
        await jest.advanceTimersByTime(100)
      })
      fireEvent.mouseEnter(getByText('tooltip!'))
      await jest.advanceTimersByTime(100)
      expect(queryByText('tooltip!')).toBeVisible()
    })

    it('should show the tooltip with arrow when arrow attribute exists', async () => {
      const { getByText, container } = render(
        <Tooltip content={ 'tooltip!' } arrow={ true }>
          <button>button</button>
        </Tooltip>
      )

      await act(async () => {
        fireEvent.mouseEnter(getByText('button'))
        await jest.advanceTimersByTime(100)
      })
      const arrowElement = container.querySelector('.popperArrow')
      expect(arrowElement).toBeVisible()
    })
  })
})
