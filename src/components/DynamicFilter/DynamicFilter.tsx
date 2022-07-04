import React, { ReactElement, useRef } from 'react'
import DynamicFilterDateTime from './components/DynamicFilterDateTime/DynamicFilterDateTime'
import DynamicFilterInfiniteListFilter from './components/DynamicFilterInfiniteListFilter/DynamicFilterInfiniteListFilter'
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
}): ReactElement => {
  const { state, actions } = UseDynamicFilterReducer()
  const btnRef = useRef<HTMLDivElement>(null)
  const { isMenuOpen } = state

  const handleBtnClick = () => {
    actions.toggleIsMenuOpen()
  }

  return (
    <DynamicFilterContext.Provider value={{ state, actions }}>
      <div
        ref={btnRef}
        className={classNames(
          styles.dynamicFilterBtn,
          isMenuOpen && styles.btnSelected,
        )}
        onClick={handleBtnClick}
      >
        <span>{title}</span>
        <ArrowDown />
      </div>
      {isMenuOpen && (
        <DynamicFilterMenu anchorElement={btnRef}>{children}</DynamicFilterMenu>
      )}
    </DynamicFilterContext.Provider>
  )
}
DynamicFilter.DateTime = DynamicFilterDateTime
DynamicFilter.InfiniteListFilter = DynamicFilterInfiniteListFilter
DynamicFilter.ListFilter = DynamicFilterListFilter
DynamicFilter.Slider = DynamicFilterSlider
DynamicFilter.Selection = DynamicFilterSelection
DynamicFilter.Sort = DynamicFilterSort

export default DynamicFilter
