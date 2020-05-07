import { useEffect, useState } from 'react'
import { usePrevious, useWindowDimensions } from '../index'

const useElementAbsolutePositioning = (
  anchorElement,
  floatingElement,
  attachDirection,
  isOpen,
  openDirection,
  isUsingPortal,
) => {
  const previousAnchorElement = usePrevious(anchorElement)
  const previousOpenState = usePrevious(isOpen)
  const [closeDirection, setCloseDirection] = useState(null)
  const {
    width: containerWidth,
    height: containerHeight,
  } = useWindowDimensions()
  const styles = {}
  const actualOpenDirection = {
    vertical: '',
    horizontal: '',
  }

  useEffect(() => {
    if (anchorElement && anchorElement !== previousAnchorElement) {
      setCloseDirection(null)
    }
  }, [anchorElement, previousAnchorElement])

  const direction = closeDirection || openDirection

  if (floatingElement && anchorElement) {
    const {
      offsetWidth: floatingElementWidth,
      offsetHeight: floatingElementHeight,
    } = floatingElement
    const [htmlTag] = document.getElementsByTagName('html')
    const htmlDirection = htmlTag.getAttribute('dir')
    const isWindowRtl = htmlDirection && htmlDirection.toLowerCase() === 'rtl'
    const {
      offsetHeight: anchorHeight,
      offsetWidth: anchorWidth,
    } = anchorElement
    const offsetTop = isUsingPortal
      ? anchorElement.getBoundingClientRect().top + window.scrollY
      : 0
    const offsetLeft = isUsingPortal
      ? anchorElement.getBoundingClientRect().left + window.scrollX
      : anchorElement.offsetLeft

    const displayElementFromAnchorElementTopUpwards = () => {
      styles.top = offsetTop - floatingElementHeight
      actualOpenDirection.vertical = 'up'
    }
    const displayElementFromAnchorElementBottomUpwards = () => {
      styles.top = offsetTop + anchorHeight - floatingElementHeight
      actualOpenDirection.vertical = 'up'
    }
    const displayElementFromAnchorElementTopDownwards = () => {
      styles.top = offsetTop
      actualOpenDirection.vertical = 'down'
    }
    const displayElementFromAnchorElementBottomDownwards = () => {
      styles.top = offsetTop + anchorHeight
      actualOpenDirection.vertical = 'down'
    }

    const displayElementFromAnchorElementStartToAnchorElementEnd = () => {
      styles.left = isWindowRtl
        ? offsetLeft + anchorWidth - floatingElementWidth
        : offsetLeft
      actualOpenDirection.horizontal = 'end'
    }
    const displayElementFromAnchorElementEnd = () => {
      styles.left = isWindowRtl
        ? offsetLeft - floatingElementWidth
        : offsetLeft + anchorWidth
      actualOpenDirection.horizontal = 'end'
    }
    const displayElementFromAnchorElementEndToAnchorElementStart = () => {
      styles.left = isWindowRtl
        ? offsetLeft
        : offsetLeft + anchorWidth - floatingElementWidth
      actualOpenDirection.horizontal = 'start'
    }
    const displayElementFromAnchorElementStart = () => {
      styles.left = isWindowRtl
        ? offsetLeft + anchorWidth
        : offsetLeft - floatingElementWidth
      actualOpenDirection.horizontal = 'start'
    }

    const isFloatingElementOutOfVerticalBounds = () => {
      let { top } = styles
      if (!isUsingPortal) {
        top += anchorElement.getBoundingClientRect().bottom
      }
      const bottom = top + floatingElementHeight
      const calculatedContainerHeight = containerHeight + (isUsingPortal ? window.scrollY : 0)
      return bottom > calculatedContainerHeight
    }
    const isFloatingElementOutOfHorizontalBounds = () => {
      let { left } = styles
      if (!isUsingPortal) {
        left += anchorElement.getBoundingClientRect().left
      }
      const right = left + floatingElementWidth
      return left < 0 || right > containerWidth
    }

    if (attachDirection === 'horizontal') {
      if (direction && direction !== 'auto') {
        const [vertical, horizontal] = direction.split('-')

        if (vertical === 'up') {
          displayElementFromAnchorElementBottomUpwards()
        } else if (vertical === 'down') {
          displayElementFromAnchorElementTopDownwards()
        }

        if (horizontal === 'start') {
          displayElementFromAnchorElementStart()
        } else if (horizontal === 'end') {
          displayElementFromAnchorElementEnd()
        }
      } else {
        displayElementFromAnchorElementTopDownwards()
        displayElementFromAnchorElementEnd()

        if (isFloatingElementOutOfVerticalBounds()) {
          displayElementFromAnchorElementBottomUpwards()
        }
        if (isFloatingElementOutOfHorizontalBounds()) {
          displayElementFromAnchorElementStart()
        }
      }
    } else if (direction && direction !== 'auto') {
      const [vertical, horizontal] = direction.split('-')

      if (vertical === 'up') {
        displayElementFromAnchorElementTopUpwards()
      } else if (vertical === 'down') {
        displayElementFromAnchorElementBottomDownwards()
      }

      if (horizontal === 'start') {
        displayElementFromAnchorElementEndToAnchorElementStart()
      } else if (horizontal === 'end') {
        displayElementFromAnchorElementStartToAnchorElementEnd()
      }
    } else {
      displayElementFromAnchorElementBottomDownwards()
      displayElementFromAnchorElementStartToAnchorElementEnd()

      if (isFloatingElementOutOfVerticalBounds()) {
        displayElementFromAnchorElementTopUpwards()
      }
      if (isFloatingElementOutOfHorizontalBounds()) {
        displayElementFromAnchorElementEndToAnchorElementStart()
      }
    }
  }

  useEffect(() => {
    if (!previousOpenState && isOpen && actualOpenDirection) {
      setCloseDirection(
        `${actualOpenDirection.vertical}-${actualOpenDirection.horizontal}`,
      )
    } else if (previousOpenState && !isOpen && closeDirection) {
      setCloseDirection(null)
    }
  }, [isOpen, previousOpenState, closeDirection, actualOpenDirection])

  return {
    styles,
    openDirection: actualOpenDirection,
  }
}

export default useElementAbsolutePositioning
