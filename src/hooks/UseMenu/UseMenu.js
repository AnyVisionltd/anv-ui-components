import { useState } from 'react'

const useMenu = ({ onCloseMenu, onOpenMenu } = {}) => {
  const [anchorElement, setAnchorElement] = useState(null)

  const onClose = () => {
    setAnchorElement(null)
    onCloseMenu?.()
  }

  const onAnchorClick = event => {
    event.stopPropagation()
    setAnchorElement(anchorElement ? null : event.currentTarget)
    onOpenMenu?.()
  }

  return {
    onAnchorClick,
    menuProps: {
      onClose,
      anchorElement,
      isOpen: Boolean(anchorElement),
    },
  }
}

export default useMenu
