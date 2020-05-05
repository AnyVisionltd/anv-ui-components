import { useWindowDimensions } from '../index'

const useElementAbsolutePositioning = (
  anchorElement,
  floatingElement,
  attachDirection,
  openDirection,
  isUsingPortal,
) => {
  const {
    width: containerWidth,
    height: containerHeight,
  } = useWindowDimensions()

  if (!anchorElement || !floatingElement) {
    return {}
  }

  const { offsetWidth: floatingElementWidth, offsetHeight: floatingElementHeight } = floatingElement
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

  const styles = {}
  const actualOpenDirection = {
    vertical: '',
    horizontal: '',
  }

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
    const { top } = styles
    const bottom = top + floatingElementHeight
    return bottom > (containerHeight + window.scrollY)
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
    if (openDirection && openDirection !== 'auto') {
      const [vertical, horizontal] = openDirection.split('-')

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
  } else if (openDirection && openDirection !== 'auto') {
    const [vertical, horizontal] = openDirection.split('-')

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

  return {
    styles,
    openDirection: actualOpenDirection,
  }
}

export default useElementAbsolutePositioning
