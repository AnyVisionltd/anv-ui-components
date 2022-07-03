import React, { FC, ReactElement, useContext, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useClickOutsideListener } from '../../../../hooks'
import DynamicFilterContext from '../../store/DynamicFilterContext'
import { maxMenuElWidth } from '../../utils'
import styles from './DynamicFilterMenu.module.scss'

interface DynamicFilterMenuProps {
  anchorElement: any
}

const DynamicFilterMenu: FC<DynamicFilterMenuProps> = ({
  children,
  anchorElement,
}): ReactElement => {
  const { state, actions } = useContext(DynamicFilterContext)
  const menuRef = useRef<HTMLDivElement>(null)
  const { isMenuOpen } = state

  const customStyle = () => {
    if (anchorElement.current) {
      const rect = anchorElement.current.getBoundingClientRect()
      const isOpenToTheRight: boolean = rect.x + rect.width - maxMenuElWidth > 0
      return {
        maxWidth: `${maxMenuElWidth}px`,
        top: `${rect.bottom}px`,
        [isOpenToTheRight ? 'right' : 'left']: isOpenToTheRight
          ? `${window.innerWidth - rect.right}px`
          : `${rect.x}px`,
      }
    }
  }

  const onClickOutSide = (event: any) => {
    if (
      !isMenuOpen ||
      (anchorElement && anchorElement.current.contains(event.target))
    ) {
      return
    }
    actions.toggleIsMenuOpen()
  }

  useClickOutsideListener(onClickOutSide, anchorElement, menuRef)

  const renderMenu = () => (
    <div className={styles.menuContainer} style={customStyle()} ref={menuRef}>
      {children}
    </div>
  )

  return createPortal(renderMenu(), anchorElement.current)
}

export default DynamicFilterMenu
