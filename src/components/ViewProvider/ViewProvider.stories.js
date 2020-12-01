import React, { useState } from 'react'
import { PencilEdit } from '@anyvision/anv-icons'
import {
  ViewProvider,
  TextField,
  Checkbox,
  Radio,
  Switch,
  IconButton,
} from '../../index'
import { centerDecorator } from '../../utils/storybook/decorators'
import styles from '../../storybook/index.module.scss'

export default {
  title: 'User Inputs/ViewProvider',
  component: ViewProvider,
  decorators: [centerDecorator],
}

const formStyle = {
  display: 'grid',
  gridGap: '8px',
}

const dividerStyle = {
  borderTop: '1px solid',
  width: '100%',
}

const fullWidthStyle = {
  width: '100%',
}

export const Basic = args => {
  const items = [
    { value: 1, label: 'Admin' },
    { value: 2, label: 'Viewer' },
  ]

  return (
    <ViewProvider {...args}>
      <div style={formStyle} className={styles.card}>
        <TextField
          label={'Username'}
          defaultValue={'AnyVisionAdmin'}
          style={fullWidthStyle}
        />
        <TextField
          type={'number'}
          label={'Age'}
          defaultValue={24}
          style={fullWidthStyle}
        />
        <TextField
          type={'password'}
          label={'Password'}
          defaultValue={'123456789'}
          style={fullWidthStyle}
        />
        <TextField
          defaultValue={1}
          type={'options'}
          items={items}
          style={fullWidthStyle}
        />
        <div className={styles.checkboxLabel}>
          <Checkbox checked />
          <label>Check box</label>
        </div>
        <div className={styles.checkboxLabel}>
          <Radio checked />
          <label>Radio Button</label>
        </div>
        <div className={styles.checkboxLabel}>
          <Switch checked />
          <label>Switch</label>
        </div>
      </div>
    </ViewProvider>
  )
}
Basic.args = {
  isView: true,
}

export const Nested = args => {
  const [isEdit, setIsEdit] = useState(true)

  return (
    <ViewProvider {...args}>
      <div className={styles.card} style={formStyle}>
        <TextField
          label={'First Name'}
          defaultValue={'Any'}
          style={fullWidthStyle}
        />
        <TextField
          label={'Last Name'}
          defaultValue={'Vision'}
          style={fullWidthStyle}
        />
        <hr style={dividerStyle} />
        <IconButton
          variant={'ghost'}
          onClick={() => setIsEdit(!isEdit)}
          style={{ justifySelf: 'end' }}
        >
          <PencilEdit />
        </IconButton>
        <ViewProvider isView={isEdit}>
          <TextField
            label={'Username'}
            defaultValue={'AnyVisionAdmin'}
            view={false}
            style={fullWidthStyle}
          />
          <TextField
            type={'password'}
            label={'Password'}
            defaultValue={'123456789'}
            style={fullWidthStyle}
          />
        </ViewProvider>
        <hr style={dividerStyle} />
        <TextField
          type={'number'}
          label={'Age'}
          defaultValue={24}
          style={fullWidthStyle}
        />
        <div className={styles.checkboxLabel}>
          <Checkbox checked />
          <label>Confirm</label>
        </div>
      </div>
    </ViewProvider>
  )
}
Nested.args = {
  isView: true,
}
