import React from 'react'
import { Tooltip } from "."
import { render, fireEvent, act } from '@testing-library/react'

describe('<Tooltip/>', () => {
    describe('Hovering over anchor component', () => {

        let button
        beforeEach(() => {
            jest.useFakeTimers()
            // mimic react useRef object
            button = {
                current: document.createElement('button')
            }
        })
        it('should display the tooltip when hovering over anchor element', async () => {
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
            const { container } = render(
                <Tooltip anchorRef={ button }>
                    <p>I'm a tooltip!</p>
                </Tooltip>
            )

            const tooltipContainer = container.firstChild
            await act(async () => {
                fireEvent.mouseLeave(button.current)
                await jest.advanceTimersByTime(500) // default leave tim is 500 so wait 500
            })
            expect(tooltipContainer).not.toBeVisible()
        })

        it('should show the tooltip after defined custom enter time', async () => {
            const customEnterTime = 10000

            const { container } = render(
                <Tooltip anchorRef={ button } enterTimer={ customEnterTime }>
                    <p>I'm a tooltip!</p>
                </Tooltip>
            )
            const tooltipContainer = container.firstChild
            await act(async () => {
                fireEvent.mouseEnter(button.current)
                // should not be visible unless enter timer is finished
                expect(tooltipContainer).not.toBeVisible()
                await jest.advanceTimersByTime(customEnterTime)
            })
            expect(tooltipContainer).toBeVisible()
        })

        it('should keep showing the tooltip for specified leave time and then hide it', async () => {
            const customLeaveTime = 10000

            const { container } = render(
                <Tooltip anchorRef={ button } leaveTimer={ customLeaveTime }>
                    <p>I'm a tooltip!</p>
                </Tooltip>
            )
            const tooltipContainer = container.firstChild
            await act(async () => {
                fireEvent.mouseEnter(button.current)
                await  jest.advanceTimersByTime(100) // wait for tooltip to show
                expect(tooltipContainer).toBeVisible() // should be visible now
                fireEvent.mouseLeave(button.current)
                await jest.advanceTimersByTime(customLeaveTime)
            })
            expect(tooltipContainer).not.toBeVisible()
        })

        it('should keep tooltip showing while the mouse is being hovered', async () => {
            const { container } = render(
                <Tooltip anchorRef={ button }>
                    <p>I'm a tooltip!</p>
                </Tooltip>
            )

            const tooltipContainer = container.firstChild
            await act(async () => {
                fireEvent.mouseEnter(button.current)
                // wait longer than the default enter time (100) and leave time (500)
                jest.advanceTimersByTime(1000)
            })
            expect(tooltipContainer).toBeVisible()
        })
    })

    describe('interactive tooltip', () => {
        describe('hovering over interactive tooltip', () => {
            let button
            beforeEach(() => {
                jest.useFakeTimers()
                // mimic react useRef object
                button = {
                    current: document.createElement('button')
                }
            })

            it('should keep the tooltip visible when hovering over the tooltip', async () => {
                const { container } = render(
                    <Tooltip anchorRef={ button } interactive>
                        <p>I'm a tooltip!</p>
                    </Tooltip>
                )
                await act(async () => {
                    fireEvent.mouseEnter(button.current)
                    await jest.advanceTimersByTime(100)
                })
                const tooltipContainer = container.firstChild
                fireEvent.mouseEnter(tooltipContainer)
                expect(tooltipContainer).toBeVisible()
            })

            it('should hide the tooltip after defined time after mouseLeave event', async () => {
                const customLeaveTime = 5000
                const { container } = render(
                    <Tooltip anchorRef={ button } leaveTimer={ customLeaveTime } interactive>
                        <p>I'm a tooltip!</p>
                    </Tooltip>
                )
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

    describe('tooltip with arrows', () => {
        let button
        beforeEach(() => {
            jest.useFakeTimers()
            // mimic react useRef object
            button = {
                current: document.createElement('button')
            }
        })
        it('should show the tooltip with arrow when arrow attribute exists', async () => {
            const { container,  } = render(
                <Tooltip anchorRef={ button } arrow>
                    <p>I'm a tooltip!</p>
                </Tooltip>
            )

            const arrowElement = container.firstChild.lastChild
            await act(async () => {
                fireEvent.mouseEnter(button.current)
                await jest.advanceTimersByTime(100)
            })
            expect(arrowElement).toHaveClass('popperArrow')
            expect(arrowElement).toBeVisible()
        })
    })
})