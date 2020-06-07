import React from 'react'
import SkeletonLoader from './SkeletonLoader'
import { centerDecorator } from "../../utils/storybook/decorators"
import styles from '../../styles/storybook/index.module.scss'

export default {
  title: 'Components/SkeletonLoader',
  component: SkeletonLoader,
  decorators: [centerDecorator],
}

const circleLoaderStyle = {
  width: '30px',
  height: '30px'
}

export const Default = () => (
  <div style={ { width: '500px' } }>
    <SkeletonLoader className={ styles.microMargin } style={ circleLoaderStyle }/>
    <SkeletonLoader className={ styles.microMargin }/>
    <SkeletonLoader className={ styles.microMargin }/>
    <SkeletonLoader className={ styles.microMargin }/>
    <SkeletonLoader className={ styles.microMargin }/>
  </div>
)
