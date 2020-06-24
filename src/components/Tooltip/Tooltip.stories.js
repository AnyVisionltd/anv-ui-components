import React, {  useRef } from 'react'
import Tooltip from './Tooltip'
import { centerDecorator } from "../../utils/storybook/decorators"
import styles from '../../styles/storybook/index.module.scss'

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
            <p>I'm a tooltip!</p>
        </Tooltip>
    </>
}

export const ArrowVariations = () => {
    const anchorRefLeft = useRef()
    const anchorRefTop = useRef()
    const anchorRefBottom = useRef()
    const anchorRefRight = useRef()

    return <div style={ { textAlign: 'center' } }>
        <h6 ref={ anchorRefLeft }>
            Left
        </h6>
        <Tooltip anchorRef={ anchorRefLeft } placement={ 'left' } arrow={ true }>
            <p>left</p>
        </Tooltip>
        <h6 ref={ anchorRefTop }>
            Top
        </h6>
        <Tooltip anchorRef={ anchorRefTop } placement={ 'top' } arrow={ true }>
            <p>top</p>
        </Tooltip>
        <h6 ref={ anchorRefBottom }>
            Bottom
        </h6>
        <Tooltip anchorRef={ anchorRefBottom } arrow={ true }>
            <p>bottom</p>
        </Tooltip>
        <h6 ref={ anchorRefRight }>
            Right
        </h6>
        <Tooltip anchorRef={ anchorRefRight } placement={ 'right' } arrow={ true }>
            <p>right</p>
        </Tooltip>
    </div>
}

export const Interactive = () => {
    const anchorRef = useRef()

    return <>
        <h6 ref={ anchorRef }>
            Hover over me!
        </h6>
        <Tooltip anchorRef={ anchorRef } placement={ 'right' }>
            <Tooltip.Title>Onboarding</Tooltip.Title>
            <Tooltip.Body>The action or process of integrating a new employee into an organization.</Tooltip.Body>
        </Tooltip>
    </>
}