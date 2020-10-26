import React from 'react'
import { render } from '@testing-library/react'
import List from './List'

describe('<List />', () => {
  it('should render children', () => {
    const { queryByText } = render(<List>mockData</List>)
    queryByText('mockData')
  })
})
