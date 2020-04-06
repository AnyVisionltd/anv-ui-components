import React from 'react'
import propTypes from 'prop-types'
import styles from './Example.module.scss'

const Example = ({ extraText }) => {
  return (
    <div className={styles.justSomeClass}>
      Hello World
      {extraText}
    </div>
  )
}

Example.defaultProps = {
  extraText: ''
}

Example.propTypes = {
  extraText: propTypes.string
}

export default Example
