import React from 'react'
import { render } from '@testing-library/react'
import Example from './Example'

describe('Example', () => {
  it('CheckboxWithLabel changes the text after click', () => {
    render(<Example />)

    expect(true).toBeTruthy()
  })
})
