import React, { ReactElement } from 'react'
import DynamicFilterDateTime from './components/DynamicFilterDateTime/DynamicFilterDateTime'
import DynamicFilterInfiniteListFilter from './components/DynamicFilterInfiniteListFilter/DynamicFilterInfiniteListFilter'
import DynamicFilterListFilter from './components/DynamicFilterListFilter/DynamicFilterListFilter'
import DynamicFilterContext from './store/DynamicFilterContext'
import UseDynamicFilterReducer from './store/UseDynamicFilterReducer'
import DynamicFilterSelection from './components/DynamicFilterSelection/DynamicFilterSelection'
import DynamicFilterSlider from './components/DynamicFilterSlider/DynamicFilterSlider'
import DynamicFilterSort from './components/DynamicFilterSort/DynamicFilterSort'
import { EyeEnabled, EyeDisabled, TimesThin } from '@anyvision/anv-icons'
import { DynamicFilterInterface } from './utils'
import styles from './DynamicFilter.module.scss'

const DynamicFilter: DynamicFilterInterface = ({
  onApply,
  onClose,
  title,
  classname,
  children,
}): ReactElement => {
  const [state, actions] = UseDynamicFilterReducer()

  return (
    <DynamicFilterContext.Provider value={{ state, actions }}>
      <div className={styles.dynamicFilterBtn}>{title}</div>
    </DynamicFilterContext.Provider>
  )
}
DynamicFilter.DateTime = DynamicFilterDateTime
DynamicFilter.InfiniteListFilter = DynamicFilterInfiniteListFilter
DynamicFilter.ListFilter = DynamicFilterListFilter
DynamicFilter.Selection = DynamicFilterSelection
DynamicFilter.Slider = DynamicFilterSlider
DynamicFilter.Sort = DynamicFilterSort

export default DynamicFilter
