import React, { createElement } from 'react'
import { addDecorator } from '@storybook/react'
import styles from './decorators.module.scss'

export const centerDecorator = (story) => <div className={ styles.center }>{ story() }</div>

addDecorator(createElement)
