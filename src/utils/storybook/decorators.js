import React, { createElement } from 'react'
import { addDecorator } from '@storybook/react'
import styles from './decorators.module.scss'

export const centerDecorator = story => <div className={ styles.center }>{ story() }</div>

/**
 * The following function was added to overcome a bug with Storyshot lib,
 * that didn't allow stories with react hooks
 * within them to load, the tests were created with errors.
 * Please see the following thread: https://github.com/storybookjs/storybook/issues/8177
 * Consider removing this line when the issue is fixed.
 */
addDecorator(createElement)
