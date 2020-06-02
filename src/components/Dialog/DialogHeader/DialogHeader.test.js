import React from 'react'
import { render } from '@testing-library/react'
import DialogHeader from './DialogHeader'


describe('<DialogHeader />', () => {
  it('should render children into dialog header', () => {
    const { queryByTestId } = render(<DialogHeader><div data-testid={ 'test-child' }/></DialogHeader>)
    expect(queryByTestId('test-child')).not.toEqual(null)
  })

  it('should not render close icon without on close function', () => {
    const { queryByTestId } = render(<DialogHeader />)
    expect(queryByTestId('dialog-header-close-icon')).toEqual(null)
  })

  it('should render close icon with on close function', () => {
    const { queryByTestId } = render(<DialogHeader onClose={ () => {} }/>)
    expect(queryByTestId('dialog-header-close-icon')).not.toEqual(null)
  })
})
