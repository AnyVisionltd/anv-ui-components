import React, { useState } from 'react'
import { PencilEdit } from '@anyvision/anv-icons'
import {
  FormProvider,
  TextField,
  Checkbox,
  Radio,
  Switch,
  IconButton,
} from '../../index'
import { centerDecorator } from '../../utils/storybook/decorators'
import styles from '../../storybook/index.module.scss'

export default {
  title: 'User Inputs/FormProvider',
  component: FormProvider,
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

export const Basic = args => {
  const items = [
    { value: 1, label: 'Admin' },
    { value: 2, label: 'Viewer' },
  ]

  return (
    <FormProvider {...args}>
      <div style={formStyle} className={styles.card}>
        <TextField
          label={'Username'}
          defaultValue={'AnyVisionAdmin'}
          className={styles.fullWidth}
        />
        <TextField
          type={'number'}
          label={'Age'}
          defaultValue={24}
          className={styles.fullWidth}
        />
        <TextField
          type={'password'}
          label={'Password'}
          defaultValue={'123456789'}
          className={styles.fullWidth}
        />
        <TextField
          defaultValue={1}
          type={'options'}
          items={items}
          className={styles.fullWidth}
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
    </FormProvider>
  )
}
Basic.args = {
  isView: true,
}

export const Nested = args => {
  const [isEdit, setIsEdit] = useState(true)

  return (
    <FormProvider {...args}>
      <div className={styles.card} style={formStyle}>
        <TextField
          label={'First Name'}
          defaultValue={'Any'}
          className={styles.fullWidth}
        />
        <TextField
          label={'Last Name'}
          defaultValue={'Vision'}
          className={styles.fullWidth}
        />
        <hr style={dividerStyle} />
        <IconButton
          variant={'ghost'}
          onClick={() => setIsEdit(!isEdit)}
          style={{ justifySelf: 'end' }}
        >
          <PencilEdit />
        </IconButton>
        <FormProvider isView={isEdit}>
          <TextField
            label={'Username'}
            defaultValue={'AnyVisionAdmin'}
            view={false}
            className={styles.fullWidth}
          />
          <TextField
            type={'password'}
            label={'Password'}
            defaultValue={'123456789'}
            className={styles.fullWidth}
          />
        </FormProvider>
        <hr style={dividerStyle} />
        <TextField
          type={'number'}
          label={'Age'}
          defaultValue={24}
          className={styles.fullWidth}
        />
        <div className={styles.checkboxLabel}>
          <Checkbox checked />
          <label>Confirm</label>
        </div>
      </div>
    </FormProvider>
  )
}
Nested.args = {
  isView: true,
}
