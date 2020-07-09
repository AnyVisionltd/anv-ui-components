import React from 'react'
import { render } from '@testing-library/react'
import DialogFooter from './DialogFooter'


describe('<DialogFooter />', () => {
  it('should render children into dialog footer', () => {
    const { queryByTestId } = render(<DialogFooter><div data-testid={ 'test-child' }/></DialogFooter>)
    expect(queryByTestId('test-child')).not.toEqual(null)
  })
})
