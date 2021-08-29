import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import propTypes from 'prop-types'

const Portal = ({ children, containerId, className, isPortalOpen }) => {
  const target = useRef(document.getElementById(containerId))

  useEffect(
    () => () => {
      if (target.current) {
        target.current.remove()
        target.current = null
      }
    },
    [],
  )

  if (!target.current) {
    target.current = document.createElement('div')
    target.current.setAttribute('id', containerId)
    target.current.classList.add(className)
    document.body.appendChild(target.current)
  }

  return createPortal(children, target.current)
}

Portal.defaultProps = {
  isPortalOpen: true,
}

Portal.propTypes = {
  /** The children to render into the `container`. */
  children: propTypes.node,
  /** Container id is unique per component (dialog, snackbar etc..).  */
  containerId: propTypes.string.isRequired,
  /** For css customization. */
  className: propTypes.string,
  /** Trigger portal unmounting when portal element is closed and not used anymore, like modal, popup.
   *  Especially recommended when rendering a list where each item is attached to a portal. */
  isPortalOpen: propTypes.bool,
}

export default Portal
