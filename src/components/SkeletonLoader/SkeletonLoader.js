import React from "react"
import propTypes from 'prop-types'
import classNames from 'classnames'
import styles from './SkeletonLoader.module.scss'

const SkeletonLoader = ({ className }) => {
  const classes = classNames(
    styles.skeletonLoader,
    className
  )

  return <span className={ classes }/>
}

SkeletonLoader.propTypes = {
  /** For css customization. */
  className: propTypes.string
}

export default SkeletonLoader
