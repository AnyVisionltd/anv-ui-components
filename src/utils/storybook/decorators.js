import React from 'react'
import styles from './decorators.module.scss'

export const centerDecorator = (story) => <div className={ styles.center }>{ story() }</div>
