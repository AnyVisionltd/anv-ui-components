import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { getByRole, getByText } from '@testing-library/dom'
import { SLIDER_SETTINGS } from './RangeSlider'
import RangeSlider from './'

describe('<RangeSlider/>', () => {
  describe('initial conditions', () => {
    it('should render correctly with default props', () => {
      const { container } = render(<RangeSlider />)

      const rangerInput = getByRole(container, 'slider')
      expect(+rangerInput.value).toBe(50)
    })

    it('should render correctly with props', () => {
      const customProps = {
        min: 5,
        max: 20,
        value: 10,
        onChange: jest.fn(),
        step: 2,
      }
      const { container } = render(<RangeSlider {...customProps} />)

      const rangerInput = getByRole(container, 'slider')
      expect(rangerInput).toHaveAttribute('min', String(5))
      expect(rangerInput).toHaveAttribute('max', String(20))
      expect(rangerInput).toHaveAttribute('step', String(2))
      expect(+rangerInput.value).toBe(10)
    })

    it('should render correctly with props that are otherProps (are not specified as expected props)', () => {
      const customClass = 'customClassName'
      const { container } = render(<RangeSlider className={customClass} />)

      const rangerInput = getByRole(container, 'slider')
      expect(rangerInput.className).toBe(customClass)
    })

    it('should render correctly with style prop', () => {
      const sliderStyle = { width: '650px' }

      const { container } = render(<RangeSlider style={sliderStyle} />)
      const rangerInput = getByRole(container, 'slider')
      expect(rangerInput.style.width).toBe(sliderStyle.width)
    })

    it('should have two spans to specify the min and max values', () => {
      const { container } = render(<RangeSlider />)

      const minLabel = getByText(container, '0')
      const maxLabel = getByText(container, '100')
      expect(minLabel).toBeTruthy()
      expect(maxLabel).toBeTruthy()
    })
  })

  describe('should change value when input is changed', () => {
    it('should change value when input is increased', () => {
      const handleChange = jest.fn()
      const { container } = render(<RangeSlider onChange={handleChange} />)

      const rangerInput = getByRole(container, 'slider')
      const value = 80
      const onChange = fireEvent.change(rangerInput, {
        target: { value },
      })
      expect(onChange).toBeTruthy()
      expect(handleChange).toHaveBeenCalledTimes(1)
    })

    it('should change value when input is decreased', () => {
      const handleChange = jest.fn()
      const { container } = render(<RangeSlider onChange={handleChange} />)

      const rangerInput = getByRole(container, 'slider')
      const value = 20
      const onChange = fireEvent.change(rangerInput, {
        target: { value },
      })
      expect(onChange).toBeTruthy()
      expect(handleChange).toHaveBeenCalledTimes(1)
    })
  })
})
