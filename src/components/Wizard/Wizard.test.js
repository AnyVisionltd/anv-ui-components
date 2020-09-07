import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import Wizard from './Wizard'


describe('<Wizard />', () => {
  it('should render dialog and backdrop when isOpen', () => {
    const { queryByTestId } = render(<Wizard isOpen/>)
    expect(queryByTestId('dialog')).not.toEqual(null)
    expect(queryByTestId('backdrop')).not.toEqual(null)
  })

  it('should render steps into Wizard', () => {
    const steps = [<div data-testid={ 'test-child' }/>]
    const { queryByTestId } = render(<Wizard isOpen steps={ steps }/>)
    expect(queryByTestId('test-child')).not.toEqual(null)
  })

  it('should change step when clicking next', () => {
    const steps = [
      <div data-testid={ 'test-child-1' } />,
      <div data-testid={ 'test-child-2' } />,
    ]
    const { getByText, queryByTestId } = render(<Wizard isOpen steps={ steps }/>)
    const nextButton = getByText('Next')
    fireEvent.click(nextButton)
    expect(queryByTestId('test-child-2')).not.toEqual(null)
  })

  it('should change step when clicking back', () => {
    const steps = [
      <div data-testid={ 'test-child-1' } />,
      <div data-testid={ 'test-child-2' } />,
      <div data-testid={ 'test-child-3' } />,
    ]
    const { getByText, getByTestId, queryByTestId } = render(<Wizard isOpen steps={ steps }/>)
    const nextButton = getByText('Next')
    fireEvent.click(nextButton)
    expect(queryByTestId('test-child-2')).not.toEqual(null)
    const backButton = getByTestId('back-button')
    fireEvent.click(backButton)
    expect(queryByTestId('test-child-1')).not.toEqual(null)
  })

  it('should render finish button when step is last', () => {
    const steps = [
      <div data-testid={ 'test-child-1' } />,
      <div data-testid={ 'test-child-2' } />,
    ]
    const { getByText } = render(<Wizard isOpen steps={ steps }/>)
    const nextButton = getByText('Next')
    fireEvent.click(nextButton)
    expect(getByText('Finish')).not.toEqual(null)
  })
})
