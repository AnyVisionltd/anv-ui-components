import React, { useState } from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import { usePopper } from 'react-popper'
import { Portal } from '../../index'
import styles from './Tooltip.module.scss'

const Tooltip = ({
  content,
  placement,
  enterDelay,
  leaveDelay,
  children,
  arrow,
  offset,
  className,
  overflowOnly
}) => {

  const [isOpen, setIsOpen ] = useState(false)
  const [anchorRef, setAnchorRef] = useState(null)
  const [popperRef, setPopperRef] = useState(null)
  const [arrowRef, setArrowRef] = useState(null)

  const enterTimer = React.useRef()
  const leaveTimer = React.useRef()

  const { styles: popperStyles, attributes } = usePopper(
    anchorRef,
    popperRef,
    {
      placement: placement,
      modifiers: [
        { name: 'arrow', options: { element: arrowRef } },
        { name: 'offset', options: { offset: [0, offset] } }
      ]
    }
  )

  const openTooltip = () => {
    clearTimeout(enterTimer.current)
    clearTimeout(leaveTimer.current)
    enterTimer.current = setTimeout(
      () => {
        setIsOpen(true)
      },
      enterDelay,
    )
  }

  const closeTooltip = () => {
    clearTimeout(enterTimer.current)
    clearTimeout(leaveTimer.current)
    leaveTimer.current = setTimeout(
      () => {
        setIsOpen(false)
      },
      leaveDelay,
    )
  }

  const handleMouseEnterTooltip = () => {
    clearTimeout(enterTimer.current)
    clearTimeout(leaveTimer.current)
  }

  const handleMouseLeaveTooltip = () => {
    closeTooltip()
  }

  const containerClasses = classNames(
    styles.popperContainer,
    className
  )

  const isOverflown = () => {
    return anchorRef && anchorRef.scrollWidth > anchorRef.clientWidth
  }

  const showTooltip = overflowOnly ? isOverflown() && isOpen : isOpen

  return (
    <>
      {
        React.cloneElement(children, {
          onMouseEnter: openTooltip,
          onMouseLeave: closeTooltip,
          ref: setAnchorRef
        })
      }

      { showTooltip ? (
        <Portal containerId={ 'tooltip' }>
          <div
            ref={ setPopperRef }
            style={ popperStyles.popper }
            { ...attributes.popper }
            onMouseEnter={ handleMouseEnterTooltip }
            onMouseLeave={ handleMouseLeaveTooltip }
            className={ containerClasses }
          >
            { content }
            { arrow &&
              <div ref={ setArrowRef } style={ popperStyles.arrow } className={ styles.popperArrow }>
                <div></div>
              </div>
            }
          </div>
        </Portal>
      ) : null }
    </>
  )
}

Tooltip.defaultProps = {
  placement: 'top',
  enterDelay: 0,
  leaveDelay: 0,
  arrow: false,
  offset: 8,
}

Tooltip.propTypes = {
  /** The tooltip content */
  content: propTypes.any.isRequired,
  /** Placement of the tooltip from the anchor element*/
  placement: propTypes.oneOf(['top','bottom','left','right']),
  /** After how much time the tooltip should appear after hovering
     * the anchor element, or tooltip when in interactive mode*/
  enterDelay: propTypes.number,
  /** After how much time the tooltip should leave after the mouse
     *  left the anchor element, or tooltip when in interactive mode*/
  leaveDelay: propTypes.number,
  /** The anchor element */
  children: propTypes.node.isRequired,
  /** Custom styles for the tooltip */
  className: propTypes.string,
  /** Whether to use arrows or not */
  arrow: propTypes.bool,
  /** The distance between the anchor element and the tooltip */
  offset: propTypes.number,
  /** Tooltip only when children overflow */
  overflowOnly: propTypes.bool,
}

export default Tooltip
