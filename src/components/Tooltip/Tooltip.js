import React, { useEffect, useState, useRef, useCallback } from 'react'
import classesNames from 'classnames'
import classes from './Tooltip.module.scss'
import { usePopper } from 'react-popper'
import { TooltipHeader } from "./TooltipHeader"
import { TooltipBody } from "./TooltipBody"
import { TooltipFooter } from "./TooltipFooter"
import propTypes from "prop-types"

const Tooltip = ({
  anchorRef,
  placement,
  enterTimer,
  leaveTimer,
  children,
  arrow,
  offset,
  className,
  interactive }) => {

  const containerClasses = classesNames(
    classes.popperContainer,
    className
  )

  const timerHide = useRef()
  const timerShow = useRef()
  const popperRef = useRef(null)
  const [isOpen, setIsOpen ] = useState(false)
  const arrowRef = useRef(null)
  const { styles, attributes, update: updatePopper  } = usePopper(anchorRef.current, popperRef.current, {
    placement: placement,
    modifiers: [
      {
        name:'computeStyles',
        options: { adaptive: false }
      },
      { name: 'arrow', options: { element: arrowRef.current } },
      { name: 'offset', options: { offset: [0, offset] } }
    ]
  })

  const setShowTimeout = useCallback(() => {
    clearTimeout(timerShow.current)
    timerShow.current = setTimeout(() => {
      setIsOpen(true)
    }, enterTimer)
  }, [enterTimer, setIsOpen])

  const setHideTimeout = useCallback(() => {
    clearTimeout(timerHide.current)
    timerHide.current = setTimeout(() => {
      setIsOpen(false)
    }, leaveTimer)
  }, [leaveTimer, setIsOpen])

  const handleAnchorMouseEnter = useCallback(() => {
    if(!isOpen) {
      setShowTimeout()
    }
  },[isOpen, setShowTimeout])

  const handleAnchorMouseLeave = useCallback(() => {
    setHideTimeout()
  }, [setHideTimeout])

  useEffect(  () => {
    async function update() {
      if(arrow && arrowRef && isOpen && updatePopper){
        await updatePopper()
      }
    }
    update()
  }, [arrow, arrowRef, isOpen, updatePopper])

  useEffect(() => {
    if(anchorRef.current) {
      anchorRef.current.onmouseenter = handleAnchorMouseEnter
      anchorRef.current.onmouseleave = handleAnchorMouseLeave
    }
  },[anchorRef, handleAnchorMouseEnter, handleAnchorMouseLeave])

  return (
    <div
      hidden={ !isOpen }
      className={ containerClasses }
      ref={ popperRef }
      style={ styles.popper }
      onMouseEnter={ interactive ? () => clearTimeout(timerHide.current) : null }
      onMouseLeave={ interactive ? setHideTimeout : null }
      { ...attributes.popper }>
      { children }
      { arrow && <div ref={ arrowRef } style={ styles.arrow } className={ classes.popperArrow } /> }
    </div>
  )
}

Tooltip.defaultProps = {
  anchorRef: null,
  placement: 'bottom',
  enterTimer: 0,
  leaveTimer: 0,
  children: null,
  arrow: false,
  offset: 5,
  interactive: false
}

Tooltip.propTypes = {
  /** Reference element used to \'anchor\' the tooltip*/
  anchorRef: propTypes.oneOfType([
    propTypes.func,
    propTypes.shape({ current: propTypes.any }),
  ]).isRequired,
  /** Placement of the tooltip from the anchor element*/
  placement: propTypes.oneOf(['top','bottom','left','right']),
  /** After how much time the tooltip should appear after hovering
     * the anchor element, or tooltip when in interactive mode*/
  enterTimer: propTypes.number,
  /** After how much time the tooltip should leave after the mouse
     *  left the anchor element, or tooltip when in interactive mode*/
  leaveTimer: propTypes.number,
  /** Content inside the tooltip container*/
  children: propTypes.node.isRequired,
  /** Custom styles for the tooltip*/
  className: propTypes.string,
  /** Whether to use arrows or not*/
  arrow: propTypes.bool,
  /** The distance between the anchor element and the tooltip*/
  offset: propTypes.number,
  /** Whether the tooltip is interactive or not. This will add the ability to
     * hover the tool tip and make it stay while being hovered.
     * This requires the <code>leaveTimer</code> to be greater than 0*/
  interactive: propTypes.bool
}

Tooltip.Header = TooltipHeader
Tooltip.Body = TooltipBody
Tooltip.Footer = TooltipFooter

export default Tooltip