import React, { useState } from 'react'
import { SunBrightens } from '@anyvision/anv-icons'
import { Tabs } from '../../index'
import { centerDecorator } from '../../utils/storybook/decorators'
import { boolean } from '@storybook/addon-knobs'

export default {
  title: 'User Inputs/Tabs',
  component: Tabs,
  decorators: [centerDecorator],
  subcomponents: {
    Item: Tabs.Item,
    Panel: Tabs.Panel,
  },
}

const containerStyle = {
  display: 'grid',
  gridGap: '8px',
}

const flexContainer = {
  display: 'flex',
  justifyContent: 'center',
}

export const Default = () => {
  const [currentTab, setCurrentTab] = useState('2')
  return (
    <div>
      <Tabs value={currentTab} onChange={setCurrentTab}>
        <Tabs.Item tabKey={'1'}>One</Tabs.Item>
        <Tabs.Item tabKey={'2'}>Two</Tabs.Item>
        <Tabs.Item tabKey={'3'}>Three</Tabs.Item>
      </Tabs>
      <Tabs.Panel current={currentTab} tabKey={'1'}>
        Tab 1 content
      </Tabs.Panel>
      <Tabs.Panel current={currentTab} tabKey={'2'}>
        Tab 2 content
      </Tabs.Panel>
      <Tabs.Panel current={currentTab} tabKey={'3'}>
        Tab 3 content
      </Tabs.Panel>
    </div>
  )
}

export const WithIcon = () => {
  const [currentTab, setCurrentTab] = useState('1')
  const [currentTabIcon, setCurrentTabIcon] = useState('1')
  return (
    <div style={containerStyle}>
      <Tabs value={currentTab} onChange={setCurrentTab}>
        <Tabs.Item tabKey={'1'} leadingIcon={<SunBrightens />}>
          One
        </Tabs.Item>
        <Tabs.Item tabKey={'2'} leadingIcon={<SunBrightens />}>
          Two
        </Tabs.Item>
        <Tabs.Item tabKey={'3'} leadingIcon={<SunBrightens />}>
          Three
        </Tabs.Item>
      </Tabs>

      <div style={flexContainer}>
        <Tabs value={currentTabIcon} onChange={setCurrentTabIcon}>
          <Tabs.Item tabKey={'1'}>
            <SunBrightens />
          </Tabs.Item>
          <Tabs.Item tabKey={'2'}>
            <SunBrightens />
          </Tabs.Item>
          <Tabs.Item tabKey={'3'}>
            <SunBrightens />
          </Tabs.Item>
        </Tabs>
      </div>
    </div>
  )
}

export const Disabled = () => {
  const [currentTab, setCurrentTab] = useState('1')
  return (
    <div style={containerStyle}>
      <Tabs value={currentTab} onChange={setCurrentTab}>
        <Tabs.Item tabKey={'1'}>One</Tabs.Item>
        <Tabs.Item tabKey={'2'} disabled>
          Two
        </Tabs.Item>
        <Tabs.Item tabKey={'3'}>Three</Tabs.Item>
      </Tabs>

      <Tabs value={'1'} disabled>
        <Tabs.Item tabKey={'1'}>One</Tabs.Item>
        <Tabs.Item tabKey={'2'}>Two</Tabs.Item>
        <Tabs.Item tabKey={'3'}>Three</Tabs.Item>
      </Tabs>
    </div>
  )
}

export const Playground = () => {
  const [currentTab, setCurrentTab] = useState('1')
  const withIcon = boolean('withIcon', false)
  const withLeadingIcon = !withIcon && boolean('leadingIcon', false)

  return (
    <Tabs
      disabled={boolean('disabled', false)}
      onChange={setCurrentTab}
      value={currentTab}
    >
      <Tabs.Item tabKey={'1'} leadingIcon={withLeadingIcon && <SunBrightens />}>
        {withIcon ? <SunBrightens /> : 'One'}
      </Tabs.Item>
      <Tabs.Item tabKey={'2'} leadingIcon={withLeadingIcon && <SunBrightens />}>
        {withIcon ? <SunBrightens /> : 'Two'}
      </Tabs.Item>
      <Tabs.Item tabKey={'3'} leadingIcon={withLeadingIcon && <SunBrightens />}>
        {withIcon ? <SunBrightens /> : 'Three'}
      </Tabs.Item>
    </Tabs>
  )
}
