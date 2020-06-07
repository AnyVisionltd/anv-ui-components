import React from "react"
import propTypes from 'prop-types'
import classNames from 'classnames'
import styles from './SkeletonLoading.module.scss'

const SkeletonLoading = ({ className }) => {
  const classes = classNames(
    styles.skeletonLoading,
    className
  )

  return <span className={ classes }/>
}

SkeletonLoading.propTypes = {
  /** For css customization. */
  className: propTypes.string
}

export default SkeletonLoading
