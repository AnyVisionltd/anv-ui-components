import React, { useRef } from 'react'
import classNames from 'classnames'
import propTypes from 'prop-types'
import { ArrowDown, AlertFilter } from '@anyvision/anv-icons'
import DynamicFilterDateTime from './components/DynamicFilterDateTime/DynamicFilterDateTime'
import DynamicFilterListFilter from './components/DynamicFilterListFilter/DynamicFilterListFilter'
import DynamicFilterContext from './store/DynamicFilterContext'
import UseDynamicFilterReducer from './store/UseDynamicFilterReducer'
import DynamicFilterSelection from './components/DynamicFilterSelection/DynamicFilterSelection'
import DynamicFilterSlider from './components/DynamicFilterSlider/DynamicFilterSlider'
import DynamicFilterSort from './components/DynamicFilterSort/DynamicFilterSort'
import DynamicFilterMenu from './components/DynamicFilterMenu/DynamicFilterMenu'
import styles from './DynamicFilter.module.scss'

const DynamicFilter = ({
  onApply,
  onClose,
  title,
  className,
  isFiltered,
  children,
}) => {
  const { state, actions } = UseDynamicFilterReducer()
  const btnRef = useRef(null)
  const { isMenuOpen } = state

  const handleBtnClick = () => {
    actions.toggleIsMenuOpen()
  }

  const handleOnApplyClick = () => {
    onApply(state.elementsState)
    actions.toggleIsMenuOpen()
  }

  const handleCancelClick = () => {
    onClose()
    actions.toggleIsMenuOpen()
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
        {title}
        <div
          className={classNames(styles.icons, {
            [styles.multipleIcons]: isFiltered,
          })}
        >
          {isFiltered && <AlertFilter className={styles.iconSvg} />}
          <ArrowDown className={styles.iconSvg} />
        </div>
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
  isFiltered: false,
}

DynamicFilter.propTypes = {
  /** The string or element of the parent Button. */
  title: propTypes.oneOfType([propTypes.string, propTypes.element]).isRequired,
  /** A callback with the elements state - (elementsState: Record<string, any>) => void . */
  onApply: propTypes.func.isRequired,
  /** A callback on closing the DynamicFilter Menu. */
  onClose: propTypes.func,
  /** For the parent Button css customization. */
  className: propTypes.string,
  /** Determine  if the filter icon appear*/
  isFiltered: propTypes.bool,
}

export default DynamicFilter
