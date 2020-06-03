import React from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import styles from './DialogFooter.module.scss'


const DialogFooter = ({ className, children, ...otherProps }) => {

  const classes = classNames(
    styles.dialogFooter,
    className,
  )

  return (
    <div className={ classes } { ...otherProps } data-testid={ 'dialog-footer' }>
      { children }
    </div>
  )
}

DialogFooter.propTypes = {
  /** For css customization */
  className: propTypes.string,
  /** Dialog components */
  children: propTypes.node
}

export default DialogFooter
