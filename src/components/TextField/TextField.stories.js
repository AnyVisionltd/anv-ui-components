import React, { useState } from 'react'
import { action } from '@storybook/addon-actions'
import { SunBrightens } from '@anyvision/anv-icons'
import { centerDecorator } from '../../utils/storybook/decorators'
import styles from '../../storybook/index.module.scss'
import TextField from './TextField'
import { boolean, select } from '@storybook/addon-knobs'
import { Menu } from '../Menu'

export default {
  title: 'User Inputs/TextField',
  component: TextField.type,
  decorators: [centerDecorator],
}

export const Basic = () => (
  <div className={styles.flexMultipleRows}>
    <TextField
      placeholder={'placeholder'}
      label={'label'}
      onChange={action('Typing')}
      defaultValue={'default value'}
      id={'textField-1'}
    />
    <TextField
      placeholder={'placeholder'}
      label={'label'}
      onChange={action('Typing')}
      defaultValue={'default value'}
      variant={'fill'}
      id={'textField-2'}
    />
  </div>
)

export const Sizes = () => (
  <div className={styles.flexMultipleRows}>
    <TextField
      placeholder={'placeholder'}
      onChange={action('Typing')}
      defaultValue={'medium'}
      id={'textField-3'}
    />
    <TextField
      placeholder={'placeholder'}
      onChange={action('Typing')}
      defaultValue={'small'}
      variant={'fill'}
      id={'textField-4'}
      size={'small'}
    />
  </div>
)

export const WithLeadingIcon = () => (
  <div className={styles.flexMultipleRows}>
    <TextField
      leadingIcon={<SunBrightens />}
      placeholder={'With leading Icon'}
      onChange={action('Typing')}
      id={'textField-7'}
    />
    <TextField
      leadingIcon={<SunBrightens />}
      placeholder={'With leading Icon'}
      onChange={action('Typing')}
      variant={'fill'}
      id={'textField-8'}
    />
  </div>
)

export const Disabled = () => (
  <div className={styles.flexMultipleRows}>
    <TextField
      leadingIcon={<SunBrightens />}
      placeholder={'disabled'}
      disabled
      id={'textField-9'}
      onClick={action('click')}
    />
    <TextField
      leadingIcon={<SunBrightens />}
      placeholder={'disabled'}
      disabled
      variant={'fill'}
      id={'textField-10'}
      onClick={action('click')}
    />
  </div>
)

export const View = () => (
  <div className={styles.flexMultipleRows}>
    <TextField
      leadingIcon={<SunBrightens />}
      placeholder={'view'}
      view
      label={'view'}
      defaultValue={'View mode'}
      onClick={action('click')}
    />
    <TextField
      leadingIcon={<SunBrightens />}
      view
      label={'This is empty '}
      onClick={action('click')}
    />
    <TextField
      leadingIcon={<SunBrightens />}
      placeholder={'view'}
      view
      label={'view'}
      onClick={action('click')}
      multiline
      defaultValue={'multiline text view mode'}
      rows={5}
    />
  </div>
)

export const withTrailingIcon = () => (
  <div className={styles.flexMultipleRows}>
    <TextField
      trailingIcon={<SunBrightens />}
      onChange={action('Typing')}
      id={'textField-11'}
    />
    <TextField
      trailingIcon={<SunBrightens />}
      onChange={action('Typing')}
      variant={'fill'}
      id={'textField-12'}
    />
  </div>
)

export const withMessage = () => (
  <div className={styles.flexMultipleRows}>
    <TextField
      trailingIcon={<SunBrightens />}
      placeholder={'placeholder'}
      onChange={action('Typing')}
      message={'Optional helper text goes here'}
      id={'textField-13'}
    />
    <TextField
      trailingIcon={<SunBrightens />}
      placeholder={'placeholder'}
      onChange={action('Typing')}
      message={'Optional helper text goes here'}
      variant={'fill'}
      id={'textField-14'}
    />
  </div>
)

export const withError = () => (
  <div className={styles.flexMultipleRows}>
    <TextField
      trailingIcon={<SunBrightens />}
      placeholder={'placeholder'}
      onChange={action('Typing')}
      message={'This is an error'}
      error
      id={'textField-15'}
    />
    <TextField
      trailingIcon={<SunBrightens />}
      placeholder={'placeholder'}
      onChange={action('Typing')}
      message={'This is an error'}
      error
      variant={'fill'}
      id={'textField-16'}
    />
  </div>
)

export const withMultiline = () => (
  <div className={styles.flexMultipleRows}>
    <TextField
      label={'placeholder'}
      onChange={action('Typing')}
      id={'textField-17'}
      multiline
      rows={5}
    />
    <TextField
      label={'placeholder'}
      onChange={action('Typing')}
      multiline
      rows={5}
      variant={'fill'}
      id={'textField-18'}
    />
  </div>
)

export const withReadOnly = () => (
  <div className={styles.flexMultipleRows}>
    <TextField
      trailingIcon={<SunBrightens />}
      placeholder={'This is read only text'}
      onChange={action('Typing')}
      defaultValue={'text'}
      readOnly
      id={'textField-19'}
    />
    <TextField
      trailingIcon={<SunBrightens />}
      placeholder={'This is read only text'}
      onChange={action('Typing')}
      readOnly
      defaultValue={'text'}
      variant={'fill'}
      id={'textField-20'}
    />
  </div>
)

export const typeOptions = () => {
  const items = [
    { value: 'Olives', label: 'Olives' },
    { value: 'Tomatoes', label: 'Tomatoes' },
  ]
  return (
    <div className={styles.flexMultipleRows}>
      <TextField
        trailingIcon={<SunBrightens />}
        type={'options'}
        onClick={action('click')}
        onChange={action('change')}
        defaultValue={'Olives'}
        id={'textField-21'}
        items={items}
      />
      <TextField
        trailingIcon={<SunBrightens />}
        type={'options'}
        variant={'fill'}
        onClick={action('click')}
        onChange={action('change')}
        defaultValue={'Olives'}
        id={'textField-22'}
        items={items}
      />
    </div>
  )
}

export const WithValue = () => {
  const [value, setValue] = useState('Olives')
  return (
    <div className={styles.flexMultipleRows}>
      <TextField
        trailingIcon={<SunBrightens />}
        onChange={({ target: { value: text } }) => setValue(text)}
        value={value}
        id={'textField-23'}
        placeholder={'placeholder'}
      />
    </div>
  )
}

export const typePassword = () => (
  <div className={styles.flexMultipleRows}>
    <TextField defaultValue={'secret'} type={'password'} id={'textField-24'} />
  </div>
)

export const WithRenderItem = () => {
  const items = [
    { value: 'Olives', label: 'Olives' },
    { value: 'Tomatoes', label: 'Tomatoes' },
  ]
  const [value, setValue] = useState({})
  const onClick = item => {
    setValue(item)
  }
  return (
    <div className={styles.flexMultipleRows}>
      <TextField
        trailingIcon={<SunBrightens />}
        onChange={item => setValue(item)}
        defaultValue={'Olives'}
        value={value.label}
        id={'textField-25'}
        items={items}
        renderItem={item => (
          <Menu.Item onClick={() => onClick(item)} key={item.value}>
            {item.label}
          </Menu.Item>
        )}
        type={'options'}
      />
    </div>
  )
}

export const WithLabel = () => {
  return (
    <div className={styles.flexMultipleRows}>
      <TextField
        trailingIcon={<SunBrightens />}
        defaultValue={'Olives'}
        label={'label'}
      />
    </div>
  )
}

export const WithPlaceholder = () => {
  return (
    <div className={styles.flexMultipleRows}>
      <TextField trailingIcon={<SunBrightens />} placeholder={'placeholder'} />
    </div>
  )
}

export const playGround = () => {
  const items = [
    { value: 'Olives', label: 'Olives' },
    { value: 'Tomatoes', label: 'Tomatoes' },
  ]
  return (
    <div className={styles.flexMultipleRows}>
      <TextField
        type={select('type', ['text', 'options', 'password'], 'text')}
        size={select('size', ['medium', 'small'], 'medium')}
        placeholder={select('placeholder', ['placeholder', ''], 'placeholder')}
        message={select('message', ['message', ''], 'message')}
        onClick={action('click')}
        readOnly={boolean('readOnly', false)}
        error={boolean('error', false)}
        value={'select something'}
        id={'textField-26'}
        items={items}
        autoFocus={boolean('autoFocus', false)}
      />
      <TextField
        type={select('type', ['text', 'options', 'password'], 'text')}
        size={select('size', ['medium', 'small'], 'medium')}
        placeholder={select('placeholder', ['placeholder', ''], 'placeholder')}
        message={select('message', ['message', ''], 'message')}
        variant={'fill'}
        onClick={action('click')}
        readOnly={boolean('readOnly', false)}
        error={boolean('error', false)}
        value={'select something'}
        id={'textField-27'}
        items={items}
        autoFocus={boolean('autoFocus', false)}
      />
    </div>
  )
}
