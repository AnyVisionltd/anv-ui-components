import React from 'react'
import propTypes from 'prop-types'
import { SkeletonLoader } from '../../SkeletonLoader'
import { PARENT_NODE_HEIGHT, DEFAULT_AMOUNT_LOADING_NODES } from '../utils'
import styles from './TreeSkeletonLoading.module.scss'

const RootNodeSkeleton = () => (
  <div className={styles.nodeSkeleton}>
    <SkeletonLoader className={styles.selectCheckbox} />
    <SkeletonLoader className={styles.nodeLabel} />
    <div className={styles.content}>
      <SkeletonLoader className={styles.expandCheckbox} />
      <SkeletonLoader className={styles.nodeInfo} />
    </div>
  </div>
)

const TreeSkeletonLoading = ({ containerRef }) => {
  const calcItemsToFillHeight = () => {
    const container = containerRef.current
    if (!container) return DEFAULT_AMOUNT_LOADING_NODES
    const height = container.offsetHeight
    return Math.floor(height / PARENT_NODE_HEIGHT)
  }

  return Array.from({ length: calcItemsToFillHeight() }, (_, index) => (
    <RootNodeSkeleton key={index} />
  ))
}

TreeSkeletonLoading.propTypes = {
  /** Nodes Container element ref. */
  containerRef: propTypes.shape({ current: propTypes.instanceOf(Element) }),
}

export default TreeSkeletonLoading
