import React from 'react'
import { action } from '@storybook/addon-actions'
import { centerDecorator } from '../../utils/storybook/decorators'
import styles from '../../styles/storybook/index.module.scss'
import { ReactComponent as SunIcon } from '../../assets/svg/Sun.svg'
import TextField from './TextField'
import { boolean, select } from '@storybook/addon-knobs'

export default {
  title: 'Components/TextField',
  component: TextField,
  decorators: [centerDecorator]
}

export const withDefaultValue = () =>
  <div className={ styles.flexMultipleRows }>
    <TextField
      placeholder={ 'placeholder' }
      onChange={ action('Typing') }
      defaultValue={ 'default value' }
      id={ 'textField-1' }
    />
    <TextField
      placeholder={ 'placeholder' }
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
      defaultValue={ 'default value' }
      id={ 'textField-3' }
    />
    <TextField
      placeholder={ 'placeholder' }
      onChange={ action('Typing') }
      defaultValue={ 'default value' }
      variant={ 'fill' }
      id={ 'textField-4' }
      size={ 'dense' }
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
    />
    <TextField
      leadingIcon={ <SunIcon /> }
      placeholder={ 'disabled' }
      disabled
      variant={ 'fill' }
      id={ 'textField-10' }
    />
  </div>
)

export const withTrailingComponent = () => (
  <div className={ styles.flexMultipleRows }>
    <TextField
      trailingComponent={ <SunIcon /> }
      onChange={ action('Typing') }
      id={ 'textField-11' }
    />
    <TextField
      trailingComponent={ <SunIcon /> }
      onChange={ action('Typing') }
      variant={ 'fill' }
      id={ 'textField-12' }
    />
  </div>
)

export const withMessage = () => (
  <div className={ styles.flexMultipleRows }>
    <TextField
      trailingComponent={ <SunIcon /> }
      placeholder={ 'placeholder' }
      onChange={ action('Typing') }
      message={ 'Optional helper text goes here' }
      id={ 'textField-13' }
    />
    <TextField
      trailingComponent={ <SunIcon /> }
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
      trailingComponent={ <SunIcon /> }
      placeholder={ 'This is a wrong value' }
      onChange={ action('Typing') }
      message={ 'This is an error' }
      error
      id={ 'textField-15' }
    />
    <TextField
      trailingComponent={ <SunIcon /> }
      placeholder={ 'This is a wrong value' }
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
      trailingComponent={ <SunIcon /> }
      placeholder={ 'This is a wrong value' }
      onChange={ action('Typing') }
      id={ 'textField-17' }
      multiline
      rows={ 5 }
    />
    <TextField
      trailingComponent={ <SunIcon /> }
      placeholder={ 'This is a wrong value' }
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
      trailingComponent={ <SunIcon /> }
      placeholder={ 'This is read only text' }
      onChange={ action('Typing') }
      value={ 'text' }
      readOnly
      id={ 'textField-19' }
    />
    <TextField
      trailingComponent={ <SunIcon /> }
      placeholder={ 'This is read only text' }
      onChange={ action('Typing') }
      readOnly
      value={ 'text' }
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
        trailingComponent={ <SunIcon /> }
        type={ 'options' }
        onClick={ action('click') }
        defaultValue={ 'Pizza Toppings' }
        id={ 'textField-21' }
        items={ items }
      />
      <TextField
        trailingComponent={ <SunIcon /> }
        type={ 'options' }
        variant={ 'fill' }
        onClick={ action('click') }
        defaultValue={ 'Pizza Toppings' }
        id={ 'textField-22' }
        items={ items }
      />
    </div>
  )
}
export const playGround = () => {
  const items = [{ value: 'Olives', label: 'Olives' }, { value: 'Tomatoes', label: 'Tomatoes' }]

  return (
    <div className={ styles.flexMultipleRows }>
      <TextField
        trailingComponent={ <SunIcon /> }
        type={ select('type', ['text', 'options'], 'text') }
        size={ select('size', ['basic', 'dense'], 'basic') }
        placeholder={ select('placeholder', ['placeholder', ''], 'placeholder') }
        message={ select('message', ['message', ''], 'message') }
        onClick={ action('click') }
        readOnly={ boolean('readOnly', false) }
        error={ boolean('error', false) }
        value={ 'select something' }
        id={ 'textField-23' }
        items={ items }
      />
      <TextField
        trailingComponent={ <SunIcon /> }
        type={ select('type', ['text', 'options'], 'text') }
        size={ select('size', ['basic', 'dense'], 'basic') }
        placeholder={ select('placeholder', ['placeholder', ''], 'placeholder') }
        message={ select('message', ['message', ''], 'message') }
        variant={ 'fill' }
        onClick={ action('click') }
        readOnly={ boolean('readOnly', false) }
        error={ boolean('error', false) }
        value={ 'select something' }
        id={ 'textField-24' }
        items={ items }
      />
    </div>
  )
}
