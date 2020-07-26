import React from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import { ReactComponent as DragIcon } from '../../../assets/svg/Drag.svg'
import styles from './ListItem.module.scss'

const ListItem = ({
  leadingComponent,
  trailingComponent,
  draggable,
  children,
  className,
  ...otherProps
}) => {
  const classes = classNames(
    styles.listItem,
    className
  )

  return (
    <div
	  className={ classes }
	  { ...otherProps }
    >
	  <div>{ leadingComponent }</div>
	  <div className={ styles.content }> { children } </div>
	  <div>{ trailingComponent }</div>
	  <div className={ styles.draggable }> { draggable && <DragIcon /> } </div>
    </div>
  )
}

ListItem.defaultProps = {

}

ListItem.propTypes = {
  /** Component before the children. */
  leadingComponent: propTypes.node,
  /** Component after the children. */
  trailingComponent: propTypes.node,
  /** For css customization. */
  className: propTypes.string
}

export default ListItem