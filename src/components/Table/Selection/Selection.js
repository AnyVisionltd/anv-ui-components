import React, { useContext, useEffect, } from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import { Portal, Animations, Checkbox, } from '../../../index'
import TableContext from '../TableContext'
import styles from './Selection.module.scss'
import { useTableData } from "../UseTableData"
import { BulkAction } from "./BulkAction"

const Selection = ({
  onChange,
  selected,
  bulkActions,
  className
}) => {
  const { state, setSelectionActivity, setSelection, deselectAll } = useContext(TableContext)
  const { totalItems } = state
  const { items, excludeMode } = state.selection
  const tableData = useTableData()

  //For data changes we need to make sure that the selected items are
  // contained within the new data
  useEffect(() => {

    const newItems = items.filter(item => !!tableData.find(item2 => item === item2.id))
    onChange && onChange({ excludeMode, items: newItems })
    setSelection({ excludeMode,items:newItems })
    // the logic don't need items in deps array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[setSelection, onChange, tableData, excludeMode])

  useEffect(() => {
    selected && setSelection(selected)
  }, [selected, setSelection])
  useEffect(() => {
    setSelection({ excludeMode: false, items: [] })
  }, [setSelection, state.filters])
  useEffect(() => {
    setSelectionActivity(true)
  }, [setSelectionActivity])

  const renderActions = () => {

    return (
      <div className={ styles.actionsContainer }>
        {
          bulkActions.map(({ icon, onClick, subMenu }, index)=> (
            <BulkAction
              icon={ icon }
              onClick={ onClick }
              subMenu={ subMenu }
              key={ index }
            />
          ))
        }
      </div>
    )
  }
  const handleDeselectAll = () => {
    deselectAll()
  }
  const renderBar = excludeMode || !!items.length
  const selectedCount = renderBar && (excludeMode ? totalItems - items.length : items.length)
  const classes = classNames(
    styles.selectionBar,
    className,
  )

  return (
    <Animations.Scale isOpen={ renderBar }>
      <Portal containerId={ 'table-selection-bar' }>
        <div className={ classes }>
          <Checkbox
            indeterminate
            onChange={ handleDeselectAll }
          />
          <div className={ styles.countContainer }>
            <span className={ styles.counter }>{ selectedCount }</span>
            <span className={ styles.counterLabel }>Items Selected</span>
          </div>
          { renderActions() }
        </div>
      </Portal>
    </Animations.Scale>
  )
}

Selection.defaultProps = {
  onChange: () => {},
  bulkActions: []
}

Selection.propTypes = {
  /** Callback fire when selection changed. */
  onChange: propTypes.func,
  /** Selected items object. (For controlled selection). */
  selected: propTypes.arrayOf(
    propTypes.shape({
      items: propTypes.array,
      excludeMode: propTypes.bool
    })
  ),
  /** Table bulk actions. <br />
   *  <code>icon</code>      - icon for the action. <br />
   *  <code>label</code>     - label for the action icon.<br />
   *  <code>submenu</code>     - submenu for the action icon.<br />
   *  <code>onClick</code>   - callback fire when action click. <br />
   **/
  bulkActions: propTypes.arrayOf(
    propTypes.shape({
      icon: propTypes.node,
      subMenu: propTypes.arrayOf(
        propTypes.shape({
          icon: propTypes.node,
          label: propTypes.string,
          onClick: propTypes.func.isRequired
        })),
      label: propTypes.string,
      onClick: propTypes.func
    })
  ).isRequired,
  /** Selection bar css customization. */
  className: propTypes.string,
}

export default Selection
