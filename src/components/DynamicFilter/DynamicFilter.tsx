import React, { useRef } from 'react'
import DynamicFilterDateTime from './components/DynamicFilterDateTime/DynamicFilterDateTime'
import DynamicFilterListFilter from './components/DynamicFilterListFilter/DynamicFilterListFilter'
import DynamicFilterContext from './store/DynamicFilterContext'
import UseDynamicFilterReducer from './store/UseDynamicFilterReducer'
import DynamicFilterSelection from './components/DynamicFilterSelection/DynamicFilterSelection'
import DynamicFilterSlider from './components/DynamicFilterSlider/DynamicFilterSlider'
import DynamicFilterSort from './components/DynamicFilterSort/DynamicFilterSort'
import { ArrowDown } from '@anyvision/anv-icons'
import { DynamicFilterInterface } from './utils'
import DynamicFilterMenu from './components/DynamicFilterMenu/DynamicFilterMenu'
import classNames from 'classnames'
import styles from './DynamicFilter.module.scss'

const DynamicFilter: DynamicFilterInterface = ({
  onApply,
  onClose,
  title,
  classname,
  children,
}): JSX.Element => {
  const { state, actions } = UseDynamicFilterReducer()
  const btnRef = useRef<HTMLDivElement>(null)
  const { isMenuOpen } = state

  const handleBtnClick = () => {
    if (isMenuOpen) {
      onClose && onClose()
    }
    actions.toggleIsMenuOpen()
  }

  const handleOnApplyClick = () => {
    onApply(state.elementsState)
    handleBtnClick()
  }

  const handleCancelClick = () => {
    handleBtnClick()
  }

  return (
    <DynamicFilterContext.Provider value={{ state, actions }}>
      <div
        ref={btnRef}
        className={classNames(
          styles.dynamicFilterBtn,
          isMenuOpen && styles.btnSelected,
          classname && classname,
        )}
        onClick={handleBtnClick}
      >
        <span>{title}</span>
        <ArrowDown className={styles.arrowSvg} />
      </div>
      {isMenuOpen && (
        <DynamicFilterMenu
          onApply={handleOnApplyClick}
          onCancel={handleCancelClick}
          anchorElement={btnRef}
        >
          {children}
        </DynamicFilterMenu>
      )}
    </DynamicFilterContext.Provider>
  )
}

DynamicFilter.DateTime = DynamicFilterDateTime
DynamicFilter.ListFilter = DynamicFilterListFilter
DynamicFilter.Slider = DynamicFilterSlider
DynamicFilter.Selection = DynamicFilterSelection
DynamicFilter.Sort = DynamicFilterSort

export default DynamicFilter