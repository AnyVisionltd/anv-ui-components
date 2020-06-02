import React, { useState } from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import classes from './Tooltip.module.scss'
import { usePopper } from 'react-popper'

const Tooltip = ({ children, tooltipContent: tooltipContent, placement }) => {
    const [referenceElement, setReferenceElement] = useState(null)
    const [popperElement, setPopperElement] = useState(null)
    const [ popperVisibility, setPopperVisibility ] = useState(false)
    const { styles, attributes } = usePopper(referenceElement, popperElement, {
        placement: placement
    })

    const handleMouseEnter = () => !popperVisibility && setPopperVisibility(true)
    const handleMouseLeave = () => !!popperVisibility && setPopperVisibility(false)

    const renderPopperElement = () => (
         <div
             className={ classes.popperContainer }
             ref={ setPopperElement }
             style={ styles.popper }
             { ...attributes.popper }>
             { tooltipContent }
        </div>
    )

    return (
        <>
            <div
                onMouseEnter={ handleMouseEnter }
                onMouseLeave={ handleMouseLeave }>
                { React.cloneElement( children,
                    {
                        onMouseEnter: handleMouseEnter,
                        onMouseLeave: handleMouseLeave,
                        ref: setReferenceElement
                    })
                }
            </div>
            { !!popperVisibility && renderPopperElement() }
        </>
    )
}

Tooltip.defaultProps = {
    title: 'placeholder',
    placement: 'bottom',
    children: null
}

Tooltip.propTypes = {
    /** The content in the tooltip*/
    title: propTypes.string,
    /** Where the tooltip will show from the reference element*/
    placement: propTypes.string,
    /** The the element(s) the tooltip will be using as a reference */
    children: propTypes.node.isRequired
}

export default Tooltip