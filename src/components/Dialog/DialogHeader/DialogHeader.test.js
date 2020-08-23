import React from 'react'
import { render } from '@testing-library/react'
import DialogHeader from './DialogHeader'


describe('<DialogHeader />', () => {
  it('should render children into dialog header', () => {
    const { queryByTestId } = render(<DialogHeader><div data-testid={ 'test-child' }/></DialogHeader>)
    expect(queryByTestId('test-child')).not.toEqual(null)
  })

  it('should render close icon', () => {
    const { queryByTestId } = render(<DialogHeader />)
    expect(queryByTestId('dialog-header-close-icon')).not.toEqual(null)
  })

  it('should not render close icon when close icon is disabled', () => {
    const { queryByTestId } = render(<DialogHeader closeIcon={ false }/>)
    expect(queryByTestId('dialog-header-close-icon')).toEqual(null)
  })
})
