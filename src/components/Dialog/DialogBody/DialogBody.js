import React from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import styles from './DialogBody.module.scss'


const DialogBody = ({ className, children, ...otherProps }) => {

  const classes = classNames(
    styles.dialogBody,
    className,
  )

  return (
    <div className={ classes } { ...otherProps } data-testid={ 'dialog-body' }>
      { children }
    </div>
  )
}

DialogBody.propTypes = {
  /** For css customization */
  className: propTypes.string,
  /** Dialog components */
  children: propTypes.node
}

export default DialogBody
