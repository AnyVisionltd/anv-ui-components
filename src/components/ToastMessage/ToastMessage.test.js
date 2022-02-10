import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { SunBrightens } from '@anyvision/anv-icons'
import languageService from '../../services/language'
import ToastMessage from './ToastMessage'

describe('<ToastMessage />', () => {
  describe('Render Snapshots', () => {
    it('should render toastMessage when isOpen true', () => {
      const { container } = render(
        <ToastMessage message='test message' isOpen />,
      )
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
        <ToastMessage
          message='test message'
          isOpen
          leadingIcon={<SunBrightens />}
        />,
      )
      expect(container).toMatchSnapshot()
    })

    it('should render custom closeIcon', () => {
      const { container } = render(
        <ToastMessage
          message='test message'
          isOpen
          closeIcon={<SunBrightens />}
        />,
      )
      expect(container).toMatchSnapshot()
    })

    it('should NOT render closeIcon', () => {
      const { container } = render(
        <ToastMessage message='test message' isOpen closeIcon={false} />,
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

    it('should fire onClose after hideTimeout', async () => {
      const onClose = jest.fn()
      render(
        <ToastMessage
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
        <ToastMessage
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

  describe('Undo Button functionality', () => {
    it('should render undo button', () => {
      render(<ToastMessage message='test message' isOpen isUndo={true} />)
      const node = screen.getByText(languageService.getTranslation('undo'))
      expect(node).toBeTruthy()
    })

    it('should render undo button and call undo callback', async () => {
      const undoCallback = () => {
        alert('TEST undo callback - display an alert')
      }
      const alertMock = jest.spyOn(window, 'alert').mockImplementation()
      render(
        <ToastMessage
          message='test message'
          isOpen
          isUndo={true}
          undoCallback={undoCallback}
        />,
      )
      const node = screen.getByText(languageService.getTranslation('undo'))
      fireEvent.click(node)
      await waitFor(() => expect(alertMock).toHaveBeenCalledTimes(1))
    })
  })
})
