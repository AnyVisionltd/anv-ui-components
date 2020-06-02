import React from 'react'
import { render } from '@testing-library/react'
import DialogHeader from './DialogHeader'


describe('<DialogHeader />', () => {
  it('should render children into dialog header', () => {
    const { queryByTestId } = render(<DialogHeader><div data-testid={ 'test-child' }/></DialogHeader>)
    expect(queryByTestId('test-child')).not.toEqual(null)
  })
})
