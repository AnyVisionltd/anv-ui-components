import React, { useRef } from 'react'
import classNames from 'classnames'
import propTypes from 'prop-types'
import { ArrowDown } from '@anyvision/anv-icons'
import DynamicFilterDateTime from './components/DynamicFilterDateTime/DynamicFilterDateTime'
import DynamicFilterListFilter from './components/DynamicFilterListFilter/DynamicFilterListFilter'
import DynamicFilterContext from './store/DynamicFilterContext'
import UseDynamicFilterReducer from './store/UseDynamicFilterReducer'
import DynamicFilterSelection from './components/DynamicFilterSelection/DynamicFilterSelection'
import DynamicFilterSlider from './components/DynamicFilterSlider/DynamicFilterSlider'
import DynamicFilterSort from './components/DynamicFilterSort/DynamicFilterSort'
import DynamicFilterMenu from './components/DynamicFilterMenu/DynamicFilterMenu'
import styles from './DynamicFilter.module.scss'

const DynamicFilter = ({ onApply, onClose, title, className, children }) => {
  const { state, actions } = UseDynamicFilterReducer()
  const btnRef = useRef(null)
  const { isMenuOpen } = state

  const handleBtnClick = () => {
    if (isMenuOpen) {
      onClose()
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
          className && className,
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

DynamicFilter.defaultProps = {
  onClose: () => {},
}

DynamicFilter.propTypes = {
  /** The string of the parent Button. */
  title: propTypes.string.isRequired,
  /** A callback with the elements state - (elementsState: Record<string, any>) => void . */
  onApply: propTypes.func.isRequired,
  /** A callback on closing the DynamicFilter Menu. */
  onClose: propTypes.func,
  /** For the parent Button css customization. */
  className: propTypes.string,
}

export default DynamicFilter
