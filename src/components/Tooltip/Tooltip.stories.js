import React, { useState } from 'react'
import Tooltip from './Tooltip'
import Button from '../Button'
import { centerDecorator } from "../../utils/storybook/decorators"

export default {
    title: 'Components/Tooltip',
    component: Tooltip,
    decorators: [centerDecorator]
}

export const Default = () => (
     <Tooltip tooltipContent="Helpful">
        <h6>Hover over me</h6>
    </Tooltip>
)