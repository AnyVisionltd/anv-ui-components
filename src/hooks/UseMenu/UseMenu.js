import { useState } from 'react'

const useMenu = ({ onCloseMenu, onOpenMenu } = {}) => {
  const [anchorElement, setAnchorElement] = useState(null)

  const onClose = () => {
    setAnchorElement(null)
    onCloseMenu && onCloseMenu()
  }

  const onAnchorClick = event => {
    event.stopPropagation()
    // eslint-disable-next-line no-unused-expressions
    anchorElement
      ? setAnchorElement(null)
      : setAnchorElement(event.currentTarget)
    onOpenMenu && onOpenMenu()
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
