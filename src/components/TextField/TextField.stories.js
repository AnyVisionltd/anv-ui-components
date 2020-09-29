import React, { useState } from 'react'
import { action } from '@storybook/addon-actions'
import { centerDecorator } from '../../utils/storybook/decorators'
import styles from '../../styles/storybook/index.module.scss'
import { ReactComponent as SunIcon } from '../../assets/svg/Sun.svg'
import TextField from './TextField'
import { boolean, select } from '@storybook/addon-knobs'
import { Menu } from '../Menu'

export default {
  title: 'Components/TextField',
  component: TextField.type,
  decorators: [centerDecorator],
}

export const withDefaultValue = () =>
  <div className={ styles.flexMultipleRows }>
    <TextField
      placeholder={ 'placeholder' }
      label={ 'label' }
      onChange={ action('Typing') }
      defaultValue={ 'default value' }
      id={ 'textField-1' }
    />
    <TextField
      placeholder={ 'placeholder' }
      label={ 'label' }
      onChange={ action('Typing') }
      defaultValue={ 'default value' }
      variant={ 'fill' }
      id={ 'textField-2' }
    />
  </div>

export const sizes = () =>
  <div className={ styles.flexMultipleRows }>
    <TextField
      placeholder={ 'placeholder' }
      onChange={ action('Typing') }
      defaultValue={ 'medium' }
      id={ 'textField-3' }
    />
    <TextField
      placeholder={ 'placeholder' }
      onChange={ action('Typing') }
      defaultValue={ 'small' }
      variant={ 'fill' }
      id={ 'textField-4' }
      size={ 'small' }
    />
  </div>

export const withLeadingIcon = () => (
  <div className={ styles.flexMultipleRows }>
    <TextField
      leadingIcon={ <SunIcon /> }
      placeholder={ 'With leading Icon' }
      onChange={ action('Typing') }
      id={ 'textField-7' }
    />
    <TextField
      leadingIcon={ <SunIcon /> }
      placeholder={ 'With leading Icon' }
      onChange={ action('Typing') }
      variant={ 'fill' }
      id={ 'textField-8' }
    />
  </div>
)

export const disabled = () => (
  <div className={ styles.flexMultipleRows }>
    <TextField
      leadingIcon={ <SunIcon /> }
      placeholder={ 'disabled' }
      disabled
      id={ 'textField-9' }
      onClick={ action('click') }
    />
    <TextField
      leadingIcon={ <SunIcon /> }
      placeholder={ 'disabled' }
      disabled
      variant={ 'fill' }
      id={ 'textField-10' }
      onClick={ action('click') }
    />
  </div>
)

export const withTrailingIcon = () => (
  <div className={ styles.flexMultipleRows }>
    <TextField
      trailingIcon={ <SunIcon /> }
      onChange={ action('Typing') }
      id={ 'textField-11' }
    />
    <TextField
      trailingIcon={ <SunIcon /> }
      onChange={ action('Typing') }
      variant={ 'fill' }
      id={ 'textField-12' }
    />
  </div>
)

export const withMessage = () => (
  <div className={ styles.flexMultipleRows }>
    <TextField
      trailingIcon={ <SunIcon /> }
      placeholder={ 'placeholder' }
      onChange={ action('Typing') }
      message={ 'Optional helper text goes here' }
      id={ 'textField-13' }
    />
    <TextField
      trailingIcon={ <SunIcon /> }
      placeholder={ 'placeholder' }
      onChange={ action('Typing') }
      message={ 'Optional helper text goes here' }
      variant={ 'fill' }
      id={ 'textField-14' }
    />
  </div>
)

export const withError = () => (
  <div className={ styles.flexMultipleRows }>
    <TextField
      trailingIcon={ <SunIcon /> }
      placeholder={ 'placeholder' }
      onChange={ action('Typing') }
      message={ 'This is an error' }
      error
      id={ 'textField-15' }
    />
    <TextField
      trailingIcon={ <SunIcon /> }
      placeholder={ 'placeholder' }
      onChange={ action('Typing') }
      message={ 'This is an error' }
      error
      variant={ 'fill' }
      id={ 'textField-16' }
    />
  </div>
)

export const withMultiline = () => (
  <div className={ styles.flexMultipleRows }>
    <TextField
      placeholder={ 'placeholder' }
      onChange={ action('Typing') }
      id={ 'textField-17' }
      multiline
      rows={ 5 }
    />
    <TextField
      placeholder={ 'placeholder' }
      onChange={ action('Typing') }
      multiline
      rows={ 5 }
      variant={ 'fill' }
      id={ 'textField-18' }
    />
  </div>
)

export const withReadOnly = () => (
  <div className={ styles.flexMultipleRows }>
    <TextField
      trailingIcon={ <SunIcon /> }
      placeholder={ 'This is read only text' }
      onChange={ action('Typing') }
      defaultValue={ 'text' }
      readOnly
      id={ 'textField-19' }
    />
    <TextField
      trailingIcon={ <SunIcon /> }
      placeholder={ 'This is read only text' }
      onChange={ action('Typing') }
      readOnly
      defaultValue={ 'text' }
      variant={ 'fill' }
      id={ 'textField-20' }
    />
  </div>
)

export const typeOptions = () => {
  const items = [{ value: 'Olives', label: 'Olives' }, { value: 'Tomatoes', label: 'Tomatoes' }]
  return (
    <div className={ styles.flexMultipleRows }>
      <TextField
        trailingIcon={ <SunIcon /> }
        type={ 'options' }
        onClick={ action('click') }
        onChange={ action('change') }
        defaultValue={ 'Olives' }
        id={ 'textField-21' }
        items={ items }
      />
      <TextField
        trailingIcon={ <SunIcon /> }
        type={ 'options' }
        variant={ 'fill' }
        onClick={ action('click') }
        onChange={ action('change') }
        defaultValue={ 'Olives' }
        id={ 'textField-22' }
        items={ items }
      />
    </div>
  )
}

export const WithValue = () => {
  const [value, setValue] = useState('Olives')
  return (
    <div className={ styles.flexMultipleRows }>
      <TextField
        trailingIcon={ <SunIcon /> }
        onChange={ ({ target : { value: text } }) => setValue(text) }
        value={ value }
        id={ 'textField-23' }
        placeholder={ 'placeholder' }
      />
    </div>
  )
}

export const typePassword = () => (
  <div className={ styles.flexMultipleRows }>
    <TextField
      defaultValue={ 'secret' }
      type={ 'password' }
      id={ 'textField-24' }
    />
  </div>
)

export const WithRenderItem = () => {
  const items = [{ value: 'Olives', label: 'Olives' }, { value: 'Tomatoes', label: 'Tomatoes' }]
  const [value, setValue] = useState({})
  const onClick = item => {
    setValue(item)
  }
  return (
    <div className={ styles.flexMultipleRows }>
      <TextField
        trailingIcon={ <SunIcon /> }
        onChange={ item => setValue(item) }
        defaultValue={ 'Olives' }
        value={ value.label }
        id={ 'textField-25' }
        items={ items }
        renderItem={ item => <Menu.Item onClick={ () => onClick(item) } key={ item.value }>{ item.label }</Menu.Item> }
        type={ 'options' }
      />
    </div>
  )
}

export const WithLabel = () => {
  return (
    <div className={ styles.flexMultipleRows }>
      <TextField
        trailingIcon={ <SunIcon /> }
        defaultValue={ 'Olives' }
        label={ 'label' }
      />
    </div>
  )
}

export const WithPlaceholder = () => {
  return (
    <div className={ styles.flexMultipleRows }>
      <TextField
        trailingIcon={ <SunIcon /> }
        placeholder={ 'placeholder' }
      />
    </div>
  )
}

export const playGround = () => {
  const items = [{ value: 'Olives', label: 'Olives' }, { value: 'Tomatoes', label: 'Tomatoes' }]
  return (
    <div className={ styles.flexMultipleRows }>
      <TextField
        type={ select('type', ['text', 'options', 'password'], 'text') }
        size={ select('size', ['medium', 'small'], 'medium') }
        placeholder={ select('placeholder', ['placeholder', ''], 'placeholder') }
        message={ select('message', ['message', ''], 'message') }
        onClick={ action('click') }
        readOnly={ boolean('readOnly', false) }
        error={ boolean('error', false) }
        value={ 'select something' }
        id={ 'textField-26' }
        items={ items }
        autoFocus={ boolean('autoFocus', false) }
      />
      <TextField
        type={ select('type', ['text', 'options', 'password'], 'text') }
        size={ select('size', ['medium', 'small'], 'medium') }
        placeholder={ select('placeholder', ['placeholder', ''], 'placeholder') }
        message={ select('message', ['message', ''], 'message') }
        variant={ 'fill' }
        onClick={ action('click') }
        readOnly={ boolean('readOnly', false) }
        error={ boolean('error', false) }
        value={ 'select something' }
        id={ 'textField-27' }
        items={ items }
        autoFocus={ boolean('autoFocus', false) }
      />
    </div>
  )
}
