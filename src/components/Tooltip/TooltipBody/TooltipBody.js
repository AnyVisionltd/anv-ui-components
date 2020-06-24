import React from 'react'
import propTypes from 'prop-types'
const TooltipBody = ({ children }) => {
    return <p>{ children }</p>
}

TooltipBody.propTypes = {
    /** The body of the tooltip */
    children: propTypes.string
}

export default  TooltipBody