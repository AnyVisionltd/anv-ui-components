import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import FileUpload from './FileUpload'
import { Simulate } from "react-dom/test-utils"


describe('<FileUpload />', () => {
  describe('Render', () => {
    it('should render children', () => {
	  const { getByText } = render(<FileUpload><div>mockText</div></FileUpload>)
	  const child = getByText('mockText')
	  expect(child).toBeInTheDocument()
    })

    it('should render file input', () => {
	  const { container } = render(<FileUpload><div>mockText</div></FileUpload>)
	  const child = container.querySelector('input')
	  expect(child).toHaveAttribute('type', 'file')
    })
  })

  describe('Events', () => {
    it('should fire onChange when uploaded files changed', () => {
	  const onChangeHandler = jest.fn()
	  const file = new File([''], 'mock.png', { type: 'image/png' })
	  const { container } = render(<FileUpload onChange={ onChangeHandler }><div>mockText</div></FileUpload>)
	  const fileInput = container.querySelector('input')
	  Simulate.change(fileInput, { target: { files: [file] } })
	  expect(onChangeHandler).toBeCalled()
    })

    // because we extend children onClick
    it('should fire children onClick', () => {
	  const handleClick = jest.fn()
	  const { getByText } = render(<FileUpload><div onClick={ handleClick }>mockText</div></FileUpload>)
	  const child = getByText('mockText')
	  fireEvent.click(child)
	  expect(handleClick).toBeCalled()
    })
  })

  describe('Input props', () => {
    it('should pass multiple and accept props to input', () => {
	  const { container } = render(<FileUpload multiple accept={ 'image/*' }><div>mockText</div></FileUpload>)
	  const fileInput = container.querySelector('input')
	  expect(fileInput).toHaveAttribute('accept', 'image/*')
	  expect(fileInput).toHaveAttribute('multiple', '')
    })
  })
})
