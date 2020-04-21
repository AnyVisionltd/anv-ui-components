import React from 'react'
import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import { default as Checkbox } from './Checkbox'

test('it is checked when set to be', () => {
  const { container } = render(<Checkbox checked/>)
  const checkbox = container.querySelector('input')
  expect(checkbox.checked).toBe(true)
})