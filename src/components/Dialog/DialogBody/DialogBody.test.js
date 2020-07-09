import React from 'react'
import { render } from '@testing-library/react'
import DialogBody from './DialogBody'


describe('<DialogBody />', () => {
  it('should render children into dialog body', () => {
    const { queryByTestId } = render(<DialogBody><div data-testid={ 'test-child' }/></DialogBody>)
    expect(queryByTestId('test-child')).not.toEqual(null)
  })
})
