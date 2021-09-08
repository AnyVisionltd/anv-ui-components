import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import propTypes from 'prop-types'

const Portal = ({ children, containerId, className }) => {
  const target = useRef(null)

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

Portal.propTypes = {
  /** The children to render into the `container`. */
  children: propTypes.node,
  /** Container id is unique per component (dialog, snackbar etc..).  */
  containerId: propTypes.string.isRequired,
  /** For css customization. */
  className: propTypes.string,
}

export default Portal
