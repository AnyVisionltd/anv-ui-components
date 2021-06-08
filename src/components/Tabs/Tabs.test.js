import React, { useState } from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import Tabs from './Tabs'

const TabsWithPanel = () => {
  const [currentTab, setCurrentTab] = useState('1')
  return (
    <>
      <Tabs value={currentTab} onChange={setCurrentTab}>
        <Tabs.Item tabKey={'1'}>mock</Tabs.Item>
        <Tabs.Item tabKey={'2'}>mock2</Tabs.Item>
      </Tabs>
      <Tabs.Panel tabKey={'1'} current={currentTab}>
        Panel 1
      </Tabs.Panel>
      <Tabs.Panel tabKey={'2'} current={currentTab}>
        Panel 2
      </Tabs.Panel>
    </>
  )
}

describe('<Tabs />', () => {
  it('should call onChange when tab clicked', () => {
    const handleOnChange = jest.fn()
    render(
      <Tabs value={'0'} onChange={handleOnChange}>
        <Tabs.Item tabKey={'1'}>mock</Tabs.Item>
        <Tabs.Item tabKey={'2'}>mock2</Tabs.Item>
      </Tabs>,
    )
    const node = screen.getByText('mock')
    const node2 = screen.getByText('mock2')
    fireEvent.click(node)
    expect(handleOnChange.mock.calls[0][0]).toBe('1')
    fireEvent.click(node)
    expect(handleOnChange.mock.calls.length).toBe(2)
    fireEvent.click(node2)
    expect(handleOnChange.mock.calls[2][0]).toBe('2')
  })

  it('should value change selected', () => {
    const { container } = render(
      <Tabs value={'2'}>
        <Tabs.Item tabKey={'1'}>mock</Tabs.Item>
        <Tabs.Item tabKey={'2'}>mock2</Tabs.Item>
      </Tabs>,
    )
    const node = container.querySelector('.active')
    expect(node.firstChild.innerHTML).toBe('mock2')
  })

  it('should prevent change when group disabled', () => {
    const handleOnChange = jest.fn()
    render(
      <Tabs value={'1'} disabled onChange={handleOnChange}>
        <Tabs.Item tabKey={'1'}>mock</Tabs.Item>
        <Tabs.Item tabKey={'2'}>mock2</Tabs.Item>
      </Tabs>,
    )
    const node = screen.getByText('mock')
    fireEvent.click(node)
    expect(handleOnChange.mock.calls.length).toBe(0)
  })

  it('should prevent change when item disabled', () => {
    const handleOnChange = jest.fn()
    render(
      <Tabs value={'1'} onChange={handleOnChange}>
        <Tabs.Item tabKey={'1'} disabled>
          mock
        </Tabs.Item>
        <Tabs.Item tabKey={'2'}>mock2</Tabs.Item>
      </Tabs>,
    )
    const node = screen.getByText('mock')
    fireEvent.click(node)
    expect(handleOnChange.mock.calls.length).toBe(0)
  })

  it('should render tab panel when selected', () => {
    render(<TabsWithPanel />)
    const node2 = screen.getByText('mock2')
    screen.getByText('Panel 1')
    fireEvent.click(node2)
    screen.getByText('Panel 2')
  })
})
