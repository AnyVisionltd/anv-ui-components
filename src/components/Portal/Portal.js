import { createPortal } from 'react-dom'
import propTypes from 'prop-types'

/**
 * getPortalElement - Should check if there is a div in the dom for the portal
 * if not -> create and return it
 * @return {HTMLElement} (element)
 */
export const getPortalElement = (elementId) => {
  let portalElement = document.getElementById(elementId)
  if (!portalElement) {
    portalElement = document.createElement('div')
    portalElement.id = elementId
    document.body.appendChild(portalElement)
  }

  return portalElement
}

/**
 * Portals provide a first-class way to render children into a DOM node
 * that exists outside the DOM hierarchy of the parent component.
 */
const Portal = (props) => {
  const { children, containerId } = props
  const mountNode = getPortalElement(containerId)

  return createPortal(children, mountNode)
}

Portal.propTypes = {
  /** The children to render into the `container`. */
  children: propTypes.node,
  /** Container id is unique per component (dialog, snackbar etc..).  */
  containerId: propTypes.string.isRequired,
}

export default Portal
