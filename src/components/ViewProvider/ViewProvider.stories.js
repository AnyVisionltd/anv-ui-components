import React from 'react'
import { ViewProvider, TextField } from '../../index'
import { centerDecorator } from '../../utils/storybook/decorators'

export default {
  title: 'User Inputs/ViewProvider',
  component: ViewProvider,
  decorators: [centerDecorator],
}

const formStyle = {
  display: 'grid',
  gridGap: '8px',
}

export const Default = args => {
  const items = [
    { value: 1, label: 'Admin' },
    { value: 2, label: 'Viewer' },
  ]

  return (
    <ViewProvider { ...args }>
      <div style={formStyle}>
        <TextField label={'Username'} defaultValue={'AnyVisionAdmin'} />
        <TextField type={'number'} label={'Age'} defaultValue={24} />
        <TextField
          type={'password'}
          label={'Password'}
          defaultValue={'123456789'}
        />
        <TextField defaultValue={1} type={'options'} items={items} />
      </div>
    </ViewProvider>
  )
}
Default.args = {
  isView: true,
}
