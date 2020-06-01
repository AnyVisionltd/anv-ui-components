import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import Dialog from './Dialog'


describe('<Dialog />', () => {
  it('should render dialog and backdrop when isOpen', () => {
    const { container } = render(<Dialog isOpen/>)
    expect(container.querySelector('.dialog')).not.toEqual(null)
    expect(container.querySelector('.backdrop')).not.toEqual(null)
  })

  it('should not render dialog and backdrop when not isOpen', () => {
    const { container } = render(<Dialog />)
    expect(container.querySelector('.dialog')).toEqual(null)
    expect(container.querySelector('.backdrop')).toEqual(null)
  })

  it('should render children into dialog', () => {
    const { container } = render(<Dialog isOpen><div className={ 'test-child' }/></Dialog>)
    const dialog = container.querySelector('.dialog')
    expect(dialog.firstChild.className).toEqual('test-child')
  })

  it('should call onClose when clicked outside the dialog', () => {
    const onClose = jest.fn()
    const { getByText } = render(
      <>
        <div>This is outside the dialog</div>
        <Dialog isOpen onClose={ onClose }>This is inside the dialog</Dialog>
      </>
    )
    const insideNode = getByText('This is inside the dialog')
    fireEvent.mouseUp(insideNode)
    expect(onClose).not.toBeCalled()
    const outsideNode = getByText('This is outside the dialog')
    fireEvent.mouseUp(outsideNode)
    expect(onClose).toBeCalled()
  })
})
