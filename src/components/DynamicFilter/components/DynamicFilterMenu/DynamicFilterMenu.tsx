import React, { FC, ReactElement, useContext, useRef } from 'react'
import { useClickOutsideListener } from '../../../../hooks'
import { Portal } from '../../../Portal'
import DynamicFilterContext from '../../store/DynamicFilterContext'
import styles from './DynamicFilterMenu.module.scss'

interface DynamicFilterMenuProps {
  anchorElement: any
}

const DynamicFilterMenu: FC<DynamicFilterMenuProps> = ({
  children,
  anchorElement,
}): ReactElement => {
  const { state, actions } = useContext(DynamicFilterContext)
  const menuRef = useRef(null)
  const { isMenuOpen } = state

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
    <div
      className={styles.menuContainer}
      style={{ top: 200, left: 200 }}
      ref={menuRef}
    >
      {children}
    </div>
  )

  return <Portal containerId={'menuContainerId'}>{renderMenu()}</Portal>
}

export default DynamicFilterMenu
