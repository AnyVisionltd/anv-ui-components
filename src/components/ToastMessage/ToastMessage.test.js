import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import ToastMessage from './ToastMessage'
import { ReactComponent as SunIcon } from '../../assets/svg/Sun.svg'

describe('<ToastMessage />', () => {
  describe('Render Snapshots', () => {
    it('should render toastMessage when isOpen true', () => {
      const { container } = render(<ToastMessage message='test message' isOpen />)
      expect(container).toMatchSnapshot()
    })

    it('should NOT render toastMessage when isOpen false', () => {
      const { container } = render(
        <ToastMessage message='test message' isOpen={false} />,
      )
      expect(container).toMatchSnapshot()
    })

    it('should render leadingIcon', () => {
      const { container } = render(
        <ToastMessage message='test message' isOpen leadingIcon={<SunIcon />} />,
      )
      expect(container).toMatchSnapshot()
    })

    it('should render custom closeIcon', () => {
      const { container } = render(
        <ToastMessage message='test message' isOpen closeIcon={<SunIcon />} />,
      )
      expect(container).toMatchSnapshot()
    })

    it('should NOT render closeIcon', () => {
      const { container } = render(
        <ToastMessage message='test message' isOpen closeIcon={false} />,
      )
      expect(container).toMatchSnapshot()
    })

    it('should render action', () => {
      const { container } = render(
        <ToastMessage message='test message' isOpen action='action' />,
      )
      expect(container).toMatchSnapshot()
    })
  })

  describe('Closing events', () => {
    it('should fire onClose when click closeButton', () => {
      const onClose = jest.fn()
      const { getByRole } = render(
        <ToastMessage message='test message' isOpen onClose={onClose} />,
      )
      const node = getByRole('button')
      fireEvent.click(node)
      expect(onClose).toHaveBeenCalledTimes(1)
    })
  })
})
