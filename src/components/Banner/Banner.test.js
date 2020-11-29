import React from 'react'
import { render } from '@testing-library/react'
import { ReactComponent as SvgIcon } from '../../../jest/assets/svgIcon.svg'
import Banner from './Banner'

describe('<Banner />', () => {
  it('should render children into Banner', () => {
    const { getByText } = render(<Banner isOpen>Banner Text</Banner>)
    const node = getByText('Banner Text')
    expect(node.innerHTML).toBe('Banner Text')
  })

  it('should render leadingIcon', () => {
    const { container } = render(
      <Banner isOpen leadingIcon={<SvgIcon />}>
        Banner Text
      </Banner>,
    )
    const node = container.querySelector('svg')
    expect(node).toBeTruthy()
  })

  it('should not render banner', () => {
    const { queryByText } = render(
      <Banner leadingIcon={<SvgIcon />}>Banner Text</Banner>,
    )
    const node = queryByText('Banner Text')
    expect(node).toBeNull()
  })

  it('should render trailingComponent', () => {
    const trailingComponent = <div>trailing component</div>
    const { getByText } = render(
      <Banner
        isOpen
        trailingComponent={trailingComponent}
        leadingIcon={<SvgIcon />}
      >
        Banner Text
      </Banner>,
    )
    const node = getByText('trailing component')
    expect(node).toBeTruthy()
  })
})
