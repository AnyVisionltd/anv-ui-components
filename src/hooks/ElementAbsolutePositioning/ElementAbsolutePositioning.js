import {useWindowDimensions} from "../WindowDimensions"

const useElementAbsolutePositioning = (position, anchorElement, floatingElement) => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions()

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
    offsetTop,
    offsetLeft
  } = anchorElement
  const offsetRight = windowWidth - anchorWidth - offsetLeft

  // If the floating element is larger than it's window, no point of positioning it
  if (floatingElement.width > windowWidth || floatingElementHeight > windowHeight) {
    return {}
  }

  if (position === 'auto') {
    // TODO automatic positioning
    return {}
  }

  const styles = {}
  const [verticalPosition, horizontalPosition] = position.split('-')

  if (verticalPosition === 'bottom') {
    styles.top = offsetTop + anchorHeight
  } else {
    styles.top = offsetTop - floatingElementHeight
  }

  if (horizontalPosition) {
    if (horizontalPosition === 'start') {
      if (isWindowRtl) {
        styles.right = offsetRight
      } else {
        styles.left = offsetLeft
      }
    } else {
      if (isWindowRtl) {
        styles.left = offsetLeft
      } else {
        styles.right = offsetRight
      }
    }
  } else {
    const delta = floatingElementWidth - anchorWidth
    styles.left = offsetLeft - delta / 2
  }

  // Normalize vertical values
  if (styles.top < 0) {
    styles.top = 0
  } else if (styles.top + floatingElementHeight > windowHeight) {
    styles.top = windowHeight - floatingElementHeight
  }

  return styles
}

export default useElementAbsolutePositioning