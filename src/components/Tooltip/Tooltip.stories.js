import React, { useEffect, useRef, useState } from 'react'
import Tooltip from './Tooltip'
import Button from '../Button'
import { centerDecorator } from "../../utils/storybook/decorators"

export default {
    title: 'Components/Tooltip',
    component: Tooltip,
    decorators: [centerDecorator]
}

export const Default = () => {
    const anchorRef = useRef()

    return <>
        <h6 ref={ anchorRef }>
            Hover over me!
        </h6>
        <Tooltip anchorRef={ anchorRef }>
            <p>Hello</p>
        </Tooltip>
    </>
}