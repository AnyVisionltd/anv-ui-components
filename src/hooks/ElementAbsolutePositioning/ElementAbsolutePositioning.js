import { useContainerDimensions } from '../ContainerDimensions'

const useElementAbsolutePositioning = (snapToSide, anchorElement, floatingElement) => {
  const {
    width: containerWidth,
    height: containerHeight,
  } = useContainerDimensions()

  if (!anchorElement || !floatingElement) {
    return {}
  }

  const cumulativeOffset = (element) => {
    let top = 0
    let left = 0
    do {
      top += element.offsetTop || 0
      left += element.offsetLeft || 0
      // eslint-disable-next-line no-param-reassign
      element = element.offsetParent
    } while (element)
    return { top, left }
  }

  const { offsetWidth: floatingElementWidth, offsetHeight: floatingElementHeight } = floatingElement
  const [htmlTag] = document.getElementsByTagName('html')
  const htmlDirection = htmlTag.getAttribute('dir')
  const isWindowRtl = htmlDirection && htmlDirection.toLowerCase() === 'rtl'
  const {
    offsetHeight: anchorHeight,
    offsetWidth: anchorWidth,
  } = anchorElement
  const { top: offsetTop, left: offsetLeft } = cumulativeOffset(anchorElement)
  const styles = {}

  const displayElementFromAnchorElementTopUpwards = () => {
    styles.top = offsetTop - floatingElementHeight
  }
  const displayElementFromAnchorElementBottomUpwards = () => {
    styles.top = offsetTop + anchorHeight - floatingElementHeight
  }
  const displayElementFromAnchorElementTopDownwards = () => {
    styles.top = offsetTop
  }
  const displayElementFromAnchorElementBottomDownwards = () => {
    styles.top = offsetTop + anchorHeight
  }

  const displayElementFromAnchorElementStartToAnchorElementEnd = () => {
    styles.left = isWindowRtl
      ? offsetLeft + anchorWidth - floatingElementWidth
      : offsetLeft
  }
  const displayElementFromAnchorElementStart = () => {
    styles.left = isWindowRtl
      ? offsetLeft + anchorWidth
      : offsetLeft - floatingElementWidth
  }
  const displayElementFromAnchorElementEndToAnchorElementStart = () => {
    styles.left = isWindowRtl
      ? offsetLeft
      : offsetLeft + anchorWidth - floatingElementWidth
  }
  const displayElementFromAnchorElementEnd = () => {
    styles.left = isWindowRtl
      ? offsetLeft - floatingElementWidth
      : offsetLeft + anchorWidth
  }

  const isFloatingElementOutOfVerticalBounds = () => {
    const topPoint = styles.top
    const bottomPoint = styles.top + floatingElementHeight
    return topPoint < 0 || bottomPoint > containerHeight
  }
  const isFloatingElementOutOfHorizontalBounds = () => {
    const leftPoint = styles.left
    const rightPoint = styles.left + floatingElementWidth
    return leftPoint < 0 || rightPoint > containerWidth
  }

  if (snapToSide) {
    displayElementFromAnchorElementTopDownwards()
    displayElementFromAnchorElementEnd()

    if (isFloatingElementOutOfVerticalBounds()) {
      displayElementFromAnchorElementBottomUpwards()
    }
    if (isFloatingElementOutOfHorizontalBounds()) {
      displayElementFromAnchorElementStart()
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

  return styles
}

export default useElementAbsolutePositioning
