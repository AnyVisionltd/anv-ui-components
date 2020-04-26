import { createPortal } from 'react-dom'
import propTypes from 'prop-types'

/**
 * getPortalElement - Should check if there is a div in the dom for the portal
 * if not -> create on body and return it
 * @return {HTMLElement} (element)
 */
const getPortalElement = (elementId) => {
  let portalElement = document.getElementById(elementId)
  if (!portalElement) {
    portalElement = document.createElement('div')
    portalElement.id = elementId
    document.body.appendChild(portalElement)
  }

  return portalElement
}

const Portal = ({ children, containerId }) => {
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
