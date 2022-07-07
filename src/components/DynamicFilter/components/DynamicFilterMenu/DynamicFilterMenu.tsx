import React, { FC, ReactElement, useContext, useRef } from 'react'
import { createPortal } from 'react-dom'
import { FilterVasa, CheckThick, TimesThick } from '@anyvision/anv-icons'
import { useClickOutsideListener } from '../../../../hooks'
import { Button } from '../../../Button'
import DynamicFilterContext from '../../store/DynamicFilterContext'
import { maxMenuElWidth } from '../../utils'
import styles from './DynamicFilterMenu.module.scss'
import { useComponentTranslation } from '../../../../hooks/UseComponentTranslation'

interface DynamicFilterMenuProps {
  anchorElement: any
  onApply: () => void
  onCancel: () => void
}

const DynamicFilterMenu: FC<DynamicFilterMenuProps> = ({
  children,
  anchorElement,
  onApply,
  onCancel,
}): ReactElement => {
  const { state, actions } = useContext(DynamicFilterContext)
  const menuRef = useRef<HTMLDivElement>(null)
  const { isMenuOpen, isDatePickerOpen } = state
  const { getComponentTranslation } = useComponentTranslation()
  const translations: Record<string, string> = getComponentTranslation(
    'dynamicFilterMenu',
  )

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
      isDatePickerOpen ||
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
      <div className={styles.itemsContainer}>{children}</div>
      <div className={styles.actionBtnContainer}>
        <Button
          onClick={onCancel}
          variant='outline'
          className={styles.actionBtnCancel}
        >
          <div className={styles.cancelBtnsWrapper}>
            <FilterVasa className={styles.vasaSvg} />
            <TimesThick className={styles.xSvg} />
          </div>
        </Button>
        <Button
          onClick={onApply}
          leadingIcon={<CheckThick />}
          className={styles.actionBtnApply}
        >
          {translations.applyBtn}
        </Button>
      </div>
    </div>
  )

  return createPortal(renderMenu(), anchorElement.current)
}

export default DynamicFilterMenu
