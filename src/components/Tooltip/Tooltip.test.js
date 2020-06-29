import React from 'react'
import { Tooltip } from "."
import { render, fireEvent, act } from '@testing-library/react'

describe('<Tooltip/>', () => {
    describe('Hovering over anchor component', () => {
        it('should display the tooltip when hovering over anchor element', async () => {

            jest.useFakeTimers()

            const button = {
                current: document.createElement('button')
            } // mimic useRef

            const { container } = render(
                <Tooltip anchorRef={ button }>
                    <p>I'm a tooltip!</p>
                </Tooltip>
            )

            const tooltipContainer = container.firstChild
            await act(async () => {
                fireEvent.mouseEnter(button.current)
                await jest.advanceTimersByTime(100) // wait for enter timeout
            })

            expect(tooltipContainer).toBeVisible()
        })

        it('should hide the tooltip when leaving anchor element', async () => {

            jest.useFakeTimers()

            const button = {
                current: document.createElement('button')
            }

            const { container } = render(
                <Tooltip anchorRef={ button }>
                    <p>I'm a tooltip!</p>
                </Tooltip>
            )

            const tooltipContainer = container.firstChild
            await act(async () => {
                fireEvent.mouseLeave(button.current)
                await jest.advanceTimersByTime(500)
            })

            expect(tooltipContainer).not.toBeVisible()
        })

        it('should show the tooltip after defined custom time', async () => {
            const customEnterTime = 10000

            jest.useFakeTimers()

            const button = {
                current: document.createElement('button')
            }

            const { container } = render(
                <Tooltip anchorRef={ button }>
                    <p>I'm a tooltip!</p>
                </Tooltip>
            )

            const tooltipContainer = container.firstChild
            await act(async () => {
                fireEvent.mouseEnter(button.current)
                await jest.advanceTimersByTime(customEnterTime)
            })

            expect(tooltipContainer).toBeVisible()
        })
    })

    describe('Hovering over the tooltip when interactive', () => {
        it('should keep the tooltip visible when hovering over the tooltip', async () => {
            jest.useFakeTimers()

            const button = {
                current: document.createElement('button')
            }

            const { container } = render(
                <Tooltip anchorRef={ button } interactive>
                    <p>I'm a tooltip!</p>
                </Tooltip>
            )

            // mimic hover over anchor behavior
            await act(async () => {
                fireEvent.mouseEnter(button.current)
                await jest.advanceTimersByTime(100)
            })

            const tooltipContainer = container.firstChild
            fireEvent.mouseEnter(tooltipContainer)
            expect(tooltipContainer).toBeVisible()
        })

        it('should hide the tooltip after defined time after mouseLeave event', async () => {
            jest.useFakeTimers()

            const customLeaveTime = 5000

            const button = {
                current: document.createElement('button')
            }

            const { container } = render(
                <Tooltip anchorRef={ button } leaveTimer={ customLeaveTime } interactive>
                    <p>I'm a tooltip!</p>
                </Tooltip>
            )

            // mimic hover over anchor behavior
            await act(async () => {
                fireEvent.mouseEnter(button.current)
                await jest.advanceTimersByTime(100)
            })

            const tooltipContainer = container.firstChild
            await act(async () => {
                fireEvent.mouseLeave(tooltipContainer)
                await jest.advanceTimersByTime(customLeaveTime)
            })

            expect(tooltipContainer).not.toBeVisible()
        })
    })
})