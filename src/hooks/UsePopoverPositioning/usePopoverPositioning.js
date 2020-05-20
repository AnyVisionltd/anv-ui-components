import { useWindowDimensions } from '../index'

const usePopoverPositioning = (
  anchorElement,
  floatingElement,
  attachAxis,
  isOpen,
  preferOpenDirection,
  isUsingPortal,
) => {

  const {
    width: containerWidth,
    height: containerHeight,
  } = useWindowDimensions()
  const positionStyles = {}
  const actualOpenDirection = {
    vertical: '',
    horizontal: '',
  }

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
      positionStyles.top = offsetTop - floatingElementHeight
      actualOpenDirection.vertical = 'up'
    }
    const displayElementFromAnchorElementBottomUpwards = () => {
      positionStyles.top = offsetTop + anchorHeight - floatingElementHeight
      actualOpenDirection.vertical = 'up'
    }
    const displayElementFromAnchorElementTopDownwards = () => {
      positionStyles.top = offsetTop
      actualOpenDirection.vertical = 'down'
    }
    const displayElementFromAnchorElementBottomDownwards = () => {
      positionStyles.top = offsetTop + anchorHeight
      actualOpenDirection.vertical = 'down'
    }

    const displayElementFromAnchorElementStartToAnchorElementEnd = () => {
      positionStyles.left = isWindowRtl
        ? offsetLeft + anchorWidth - floatingElementWidth
        : offsetLeft
      actualOpenDirection.horizontal = 'end'
    }
    const displayElementFromAnchorElementEnd = () => {
      positionStyles.left = isWindowRtl
        ? offsetLeft - floatingElementWidth
        : offsetLeft + anchorWidth
      actualOpenDirection.horizontal = 'end'
    }
    const displayElementFromAnchorElementEndToAnchorElementStart = () => {
      positionStyles.left = isWindowRtl
        ? offsetLeft
        : offsetLeft + anchorWidth - floatingElementWidth
      actualOpenDirection.horizontal = 'start'
    }
    const displayElementFromAnchorElementStart = () => {
      positionStyles.left = isWindowRtl
        ? offsetLeft + anchorWidth
        : offsetLeft - floatingElementWidth
      actualOpenDirection.horizontal = 'start'
    }

    const isFloatingElementOutOfVerticalBounds = () => {
      let { top } = positionStyles
      if (!isUsingPortal) {
        top += anchorElement.getBoundingClientRect().bottom
      }
      const bottom = top + floatingElementHeight
      const calculatedContainerHeight = containerHeight + (isUsingPortal ? window.scrollY : 0)
      return bottom > calculatedContainerHeight
    }
    const isFloatingElementOutOfHorizontalBounds = () => {
      let { left } = positionStyles
      if (!isUsingPortal) {
        left += anchorElement.getBoundingClientRect().left
      }
      const right = left + floatingElementWidth
      return left < 0 || right > containerWidth
    }

    if (attachAxis === 'vertical') {
      const [vertical, horizontal] = preferOpenDirection.split('-')
      displayElementFromAnchorElementBottomDownwards()
      displayElementFromAnchorElementStartToAnchorElementEnd()

      if (vertical === 'up' || isFloatingElementOutOfVerticalBounds()) {
        displayElementFromAnchorElementTopUpwards()
      }

      if (horizontal === 'start' || isFloatingElementOutOfHorizontalBounds()) {
        displayElementFromAnchorElementEndToAnchorElementStart()
      }
    } else {
      const [vertical, horizontal] = preferOpenDirection.split('-')
      displayElementFromAnchorElementTopDownwards()
      displayElementFromAnchorElementEnd()

      if (vertical === 'up' || isFloatingElementOutOfVerticalBounds()) {
        displayElementFromAnchorElementBottomUpwards()
      }

      if (horizontal === 'start' || isFloatingElementOutOfHorizontalBounds()) {
        displayElementFromAnchorElementStart()
      }
    }
  }

  if(isOpen) {
    floatingElement.style.top = `${positionStyles.top}px`
    floatingElement.style.left = `${positionStyles.left}px`
  }

  return actualOpenDirection
}

export default usePopoverPositioning
