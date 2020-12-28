import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import Snackbar from './Snackbar'
import { ReactComponent as SunIcon } from '../../assets/svg/Sun.svg'

describe('<Snackbar />', () => {
  describe('Render Snapshots', () => {
    it('should render snackbar when isOpen true', () => {
      const { container } = render(<Snackbar message='test message' isOpen />)
      expect(container).toMatchSnapshot()
    })

    it('should NOT render snackbar when isOpen false', () => {
      const { container } = render(
        <Snackbar message='test message' isOpen={false} />,
      )
      expect(container).toMatchSnapshot()
    })

    it('should render leadingIcon', () => {
      const { container } = render(
        <Snackbar message='test message' isOpen leadingIcon={<SunIcon />} />,
      )
      expect(container).toMatchSnapshot()
    })

    it('should render custom closeIcon', () => {
      const { container } = render(
        <Snackbar message='test message' isOpen closeIcon={<SunIcon />} />,
      )
      expect(container).toMatchSnapshot()
    })

    it('should NOT render closeIcon', () => {
      const { container } = render(
        <Snackbar message='test message' isOpen closeIcon={false} />,
      )
      expect(container).toMatchSnapshot()
    })

    it('should render action', () => {
      const { container } = render(
        <Snackbar message='test message' isOpen action='action' />,
      )
      expect(container).toMatchSnapshot()
    })
  })

  describe('Closing events', () => {
    it('should fire onClose when click closeButton', () => {
      const onClose = jest.fn()
      const { getByRole } = render(
        <Snackbar message='test message' isOpen onClose={onClose} />,
      )
      const node = getByRole('button')
      fireEvent.click(node)
      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('should fire onClose after hideTimeout', async () => {
      const onClose = jest.fn()
      render(
        <Snackbar
          message='test message'
          isOpen
          onClose={onClose}
          hideTimeout={1}
        />,
      )
      await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1))
    })

    it('should NOT fire onClose after hideTimeout', async () => {
      const onClose = jest.fn()
      const { container } = render(
        <Snackbar
          message='test message'
          isOpen
          onClose={onClose}
          hideTimeout={1}
        />,
      )
      const node = container.firstChild.firstChild
      fireEvent.mouseEnter(node)
      await waitFor(() => expect(onClose).toHaveBeenCalledTimes(0))
      fireEvent.mouseLeave(node)
      await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1))
    })
  })
})
