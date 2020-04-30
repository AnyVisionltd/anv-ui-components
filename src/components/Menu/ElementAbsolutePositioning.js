import { useContainerDimensions } from '../../hooks/ContainerDimensions'

const useElementAbsolutePositioning = (snapToSide, anchorElement, floatingElement) => {
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
  const { offsetTop: anchorTop, offsetLeft } = anchorElement
  const offsetTop = snapToSide ? 0 : anchorTop
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

  const isFloatingElementOutOfVerticalBounds = () => {
    let topPoint = styles.top
    if (snapToSide) {
      const { top: anchorTopOffsetInRelationToViewport } = anchorElement.getBoundingClientRect()
      topPoint += anchorTopOffsetInRelationToViewport
    }
    const bottomPoint = topPoint + floatingElementHeight
    return topPoint < 0 || bottomPoint > containerHeight
  }
  const isFloatingElementOutOfHorizontalBounds = () => {
    let leftPoint = styles.left
    if (snapToSide) {
      leftPoint += anchorElement.getBoundingClientRect().left
    }
    const rightPoint = leftPoint + floatingElementWidth
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

  return {
    styles,
    classNames,
  }
}

export default useElementAbsolutePositioning
