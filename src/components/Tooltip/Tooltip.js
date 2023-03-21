import React, { useState, useEffect, useCallback } from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import { usePopper } from 'react-popper'
import { useClickOutsideListener } from '../../hooks/UseClickOutsideListener'
import { Portal } from '../../index'
import styles from './Tooltip.module.scss'

const Tooltip = ({
  show,
  content,
  placement,
  enterDelay,
  leaveDelay,
  children,
  arrow,
  offset,
  className,
  arrowClassName,
  overflowOnly,
  clickOnly,
  showAlways,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [anchorRef, setAnchorRef] = useState(null)
  const [popperRef, setPopperRef] = useState(null)
  const [arrowRef, setArrowRef] = useState(null)

  const enterTimer = React.useRef()
  const leaveTimer = React.useRef()

  const { styles: popperStyles, attributes } = usePopper(anchorRef, popperRef, {
    placement: placement,
    modifiers: [
      { name: 'arrow', options: { element: arrowRef } },
      { name: 'offset', options: { offset: [0, offset] } },
    ],
  })

  // Temp solution for: https://github.com/facebook/react/issues/10396
  const closeTooltip = useCallback(() => {
    clearTimeout(enterTimer.current)
    clearTimeout(leaveTimer.current)
    leaveTimer.current = setTimeout(() => {
      setIsOpen(false)
    }, leaveDelay)
  }, [leaveDelay])

  useEffect(() => {
    anchorRef &&
      !clickOnly &&
      anchorRef.addEventListener('mouseleave', closeTooltip)
    return () => {
      anchorRef &&
        !clickOnly &&
        anchorRef.removeEventListener('mouseleave', closeTooltip)
    }
  }, [anchorRef, closeTooltip, clickOnly])

  useClickOutsideListener(
    () => {
      if (!isOpen) {
        return
      }
      closeTooltip()
    },
    { current: popperRef },
  )

  const openTooltip = () => {
    clearTimeout(enterTimer.current)
    clearTimeout(leaveTimer.current)
    enterTimer.current = setTimeout(() => {
      setIsOpen(true)
    }, enterDelay)
  }

  const handleMouseEnterTooltip = () => {
    clearTimeout(enterTimer.current)
    clearTimeout(leaveTimer.current)
  }

  const handleMouseLeaveTooltip = () => {
    if (!clickOnly) {
      closeTooltip()
    }
  }

  const containerClasses = classNames(styles.popperContainer, className)

  const isOverflown = () => {
    return anchorRef && anchorRef.scrollWidth > anchorRef.clientWidth
  }

  const isOverflownAndOpen = isOverflown() && isOpen

  const isTooltipOpen = overflowOnly ? isOverflownAndOpen : isOpen

  const showTooltip = (show ? isTooltipOpen : false) || showAlways

  return (
    <>
      {React.cloneElement(children, {
        ...(clickOnly
          ? { onClick: () => !isOpen && openTooltip() }
          : { onMouseEnter: openTooltip }),
        ref: setAnchorRef,
        className: classNames(children.props.className, styles.childrenStyle),
      })}

      {showTooltip ? (
        <Portal containerId={'tooltip'}>
          <div
            ref={setPopperRef}
            style={popperStyles.popper}
            {...attributes.popper}
            onMouseEnter={handleMouseEnterTooltip}
            onMouseLeave={handleMouseLeaveTooltip}
            className={containerClasses}
          >
            {content}
            {arrow && (
              <div
                ref={setArrowRef}
                style={popperStyles.arrow}
                className={classNames(styles.popperArrow, arrowClassName)}
              >
                <div />
              </div>
            )}
          </div>
        </Portal>
      ) : null}
    </>
  )
}

Tooltip.defaultProps = {
  show: true,
  placement: 'top',
  enterDelay: 0,
  leaveDelay: 0,
  arrow: false,
  offset: 8,
  showAlways: false,
  clickOnly: false,
}

Tooltip.propTypes = {
  /** The tooltip content */
  content: propTypes.any,
  /** Show or hide tooltip */
  show: propTypes.bool,
  /** Placement of the tooltip from the anchor element*/
  placement: propTypes.oneOf(['top', 'bottom', 'left', 'right']),
  /** After how much time the tooltip should appear after hovering
   * the anchor element, or tooltip when in interactive mode*/
  enterDelay: propTypes.number,
  /** After how much time the tooltip should leave after the mouse
   *  left the anchor element, or tooltip when in interactive mode*/
  leaveDelay: propTypes.number,
  /** The anchor element */
  children: propTypes.node,
  /** Custom styles for the tooltip */
  className: propTypes.string,
  /** Whether to use arrows or not */
  arrow: propTypes.bool,
  /** Custom styles for the arrow of the tooltip */
  arrowClassName: propTypes.string,
  /** The distance between the anchor element and the tooltip */
  offset: propTypes.number,
  /** Tooltip only when children overflow */
  overflowOnly: propTypes.bool,
  /** Tooltip only on clicking the element */
  clickOnly: propTypes.bool,
  /** Tooltip always open */
  alwaysShow: propTypes.bool,
}

export default Tooltip
