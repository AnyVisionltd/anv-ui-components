import React from 'react'
import propTypes from 'prop-types'
import styles from './TooltipTitle.module.scss'

const TooltipTitle = ({ children }) => {
    return <p className={ styles.tooltipTitle }>{ children }</p>
}

TooltipTitle.propTypes = {
    /** The title of the tooltip*/
    children: propTypes.string.isRequired
}

export default TooltipTitle