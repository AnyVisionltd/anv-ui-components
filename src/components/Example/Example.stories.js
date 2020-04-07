/*
 -----------------------------------------
* Example and best practice
* Storybook - https://gumdrops.gumgum.com/index.html?path=/story/atoms--button
* Code - https://github.com/gumgum/gumdrops/blob/master/_stories/atoms/Button/index.js
* -----------------------------------------
* */

import React from 'react'
import { text } from '@storybook/addon-knobs'

import Example from './Example'

export default {
  title: 'Components',
  component: Example,
}

export const exampleTitle = () => (
  <Example
    extraText={ text('extraText', '') }
    className={ text('className', '') }
  />
)
