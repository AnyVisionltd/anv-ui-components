import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import propTypes from 'prop-types'
import classes from './Tooltip.module.scss'
import { usePopper } from 'react-popper'
import ScaleAnimation from "../Animations/ScaleAnimation/ScaleAnimation"
import { TooltipTitle } from "./TooltipTitle"
import { TooltipBody } from "./TooltipBody"
const Tooltip = ({
     anchorRef,
     placement,
     enterTimer,
     leaveTimer,
     children,
     arrow,
     width,
     offset }) => {

    const popperRef = useRef(null)
    const [isOpen, setIsOpen ] = useState(false)
    const [arrowRef, setArrowRef] = useState(null)
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

    const handleMouseEnter = useCallback(() => {
        setTimeout(() => setIsOpen(true), enterTimer)
    },[enterTimer])

    const handleMouseLeave = useCallback(() => {
        setTimeout(() => setIsOpen(false), leaveTimer)
    }, [leaveTimer])

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
            anchorRef.current.onmouseenter = handleMouseEnter
            anchorRef.current.onmouseleave = handleMouseLeave
        }
    },[anchorRef, handleMouseEnter, handleMouseLeave])

    console.log("styles: ", styles.popper)

    const popperStyles = {
        ...styles.popper,
        width: width || 'auto'
    }

    return (
        <ScaleAnimation isOpen={ isOpen }>
            <div
                className={ classes.popperContainer }
                ref={ popperRef }
                style={ popperStyles }
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
    width: null
}

Tooltip.Title = TooltipTitle
Tooltip.Body = TooltipBody

export default Tooltip