import React, { useEffect, useState, useRef, useCallback } from 'react'
import propTypes from 'prop-types'
import classes from './Tooltip.module.scss'
import { usePopper } from 'react-popper'
import ScaleAnimation from "../Animations/ScaleAnimation/ScaleAnimation"


const Tooltip = props => {
    const {
        anchorRef,
        placement,
        enterTimer,
        leaveTimer,
        children } = props

    const popperRef = useRef(null)
    const [isOpen, setIsOpen ] = useState(false)
    const { styles, attributes } = usePopper(anchorRef.current, popperRef.current, {
        placement: placement,
        modifiers: [
            {
                name:'computeStyles',
                options: { 'adaptive': false }
            }
        ]
    })

    const handleMouseEnter = useCallback(() => {
        setTimeout(() => setIsOpen(true), enterTimer)
    },[enterTimer])

    const handleMouseLeave = useCallback(() => {
        setTimeout(() => setIsOpen(false), leaveTimer)
    }, [leaveTimer])

    useEffect(() => {
        if(anchorRef.current) {
            anchorRef.current.onmouseenter = handleMouseEnter
            anchorRef.current.onmouseleave = handleMouseLeave
        }
    },[anchorRef, handleMouseEnter, handleMouseLeave])

    const renderPopper =  () =>
        (
            <ScaleAnimation isOpen={ isOpen }>
                <div
                    className={ classes.popperContainer }
                    ref={ popperRef }
                    style={ styles.popper }
                    { ...attributes.popper }>
                    { children }
                </div>
            </ScaleAnimation>
            
        )

    return renderPopper()
}

Tooltip.defaultProps = {
    title: 'placeholder',
    placement: 'bottom',
    enterTimer: 100,
    leaveTimer: 200,
    children: null
}

export default Tooltip