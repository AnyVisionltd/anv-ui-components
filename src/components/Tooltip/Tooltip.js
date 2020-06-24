import React, { useEffect, useState, useRef, useCallback } from 'react'
import classesNames from 'classnames'
import classes from './Tooltip.module.scss'
import { usePopper } from 'react-popper'
import ScaleAnimation from "../Animations/ScaleAnimation/ScaleAnimation"
import { TooltipHeader } from "./TooltipHeader"
import { TooltipBody } from "./TooltipBody"
import { TooltipFooter } from "./TooltipFooter"

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

    const popperRef = useRef(null)
    const [isOpen, setIsOpen ] = useState(false)
    const [arrowRef, setArrowRef] = useState(null)
    const [popperIsHovered, setPopperIsHovered] = useState(false)
    const { styles, attributes, update: updatePopper  } = usePopper(anchorRef.current, popperRef.current, {
        placement: placement,
        modifiers: [
            {
                name:'computeStyles',
                options: { adaptive: false }
            },
            { name: 'arrow', options: { element: arrowRef } },
            { name: 'offset', options: { offset: [0, offset] } }
        ]
    })

    const handleAnchorMouseEnter = useCallback(() => {
        togglePopper(true, enterTimer)
    },[enterTimer])

    const handleAnchorMouseLeave = useCallback(() => {
        if(!interactive || !popperIsHovered) {
            togglePopper(false, leaveTimer)
        }
    }, [leaveTimer, interactive, popperIsHovered])

    const handlePopperMouseEnter = () => setPopperIsHovered(true)
    const handlePopperMouseLeave = () => {
        setPopperIsHovered(false)
        togglePopper(false, leaveTimer)
    }

    const togglePopper = (isPopperOpen, timer) => {
        setTimeout(() => setIsOpen(isPopperOpen), timer)
    }

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
        <ScaleAnimation isOpen={ isOpen }>
            <div
                className={ containerClasses }
                ref={ popperRef }
                style={ styles.popper }
                onMouseEnter={ interactive ? handlePopperMouseEnter : null }
                onMouseLeave={ interactive ? handlePopperMouseLeave : null  }
                { ...attributes.popper }>
                { children }
                { arrow && <div ref={ setArrowRef } style={ styles.arrow } className={ classes.popperArrow } /> }
            </div>
        </ScaleAnimation>
    )
}

Tooltip.defaultProps = {
    anchorRef: null,
    placement: 'bottom',
    enterTimer: 100,
    leaveTimer: 200,
    children: null,
    arrow: false,
    offset: 5,
    interactive: false
}

Tooltip.Header = TooltipHeader
Tooltip.Body = TooltipBody
Tooltip.Footer = TooltipFooter

export default Tooltip