import { useContainerDimensions } from '../index'

const useElementAbsolutePositioning = (
  anchorElement,
  floatingElement,
  snapToSide,
  isUsingPortal,
) => {
  const {
    width: containerWidth,
    height: containerHeight,
  } = useContainerDimensions()

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
  const classNames = {
    vertical: '',
    horizontal: '',
  }

  const displayElementFromAnchorElementTopUpwards = () => {
    styles.top = offsetTop - floatingElementHeight
    classNames.vertical = 'fromAnchorElementTopUpwards'
  }
  const displayElementFromAnchorElementBottomUpwards = () => {
    styles.top = offsetTop + anchorHeight - floatingElementHeight
    classNames.vertical = 'fromAnchorElementBottomUpwards'
  }
  const displayElementFromAnchorElementTopDownwards = () => {
    styles.top = offsetTop
    classNames.vertical = 'fromAnchorElementTopDownwards'
  }
  const displayElementFromAnchorElementBottomDownwards = () => {
    styles.top = offsetTop + anchorHeight
    classNames.vertical = 'fromAnchorElementBottomDownwards'
  }

  const displayElementFromAnchorElementStartToAnchorElementEnd = () => {
    styles.left = isWindowRtl
      ? offsetLeft + anchorWidth - floatingElementWidth
      : offsetLeft
    classNames.horizontal = 'fromAnchorElementStartToAnchorElementEnd'
  }
  const displayElementFromAnchorElementStart = () => {
    styles.left = isWindowRtl
      ? offsetLeft + anchorWidth
      : offsetLeft - floatingElementWidth
    classNames.horizontal = 'fromAnchorElementStart'
  }
  const displayElementFromAnchorElementEndToAnchorElementStart = () => {
    styles.left = isWindowRtl
      ? offsetLeft
      : offsetLeft + anchorWidth - floatingElementWidth
    classNames.horizontal = 'fromAnchorElementEndToAnchorElementStart'
  }
  const displayElementFromAnchorElementEnd = () => {
    styles.left = isWindowRtl
      ? offsetLeft - floatingElementWidth
      : offsetLeft + anchorWidth
    classNames.horizontal = 'fromAnchorElementEnd'
  }

  const getClosestScrollableParent = (node) => {
    if (node == null) {
      return null
    }

    if (node.scrollHeight > node.clientHeight) {
      return node
    } else {
      return getClosestScrollableParent(node.parentNode)
    }
  }

  const isFloatingElementOutOfVerticalBounds = () => {
    const { top } = styles
    const bottom = top + floatingElementHeight
    return bottom > containerHeight
  }
  const isFloatingElementOutOfHorizontalBounds = () => {
    let { left } = styles
    if (!isUsingPortal) {
      left += anchorElement.getBoundingClientRect().left
    }
    const right = left + floatingElementWidth
    return left < 0 || right > containerWidth
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

  return {
    styles,
    classNames,
  }
}

export default useElementAbsolutePositioning
