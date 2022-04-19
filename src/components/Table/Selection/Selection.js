import React, { useContext, useEffect, useImperativeHandle } from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import { Portal, Animations, Checkbox } from '../../../index'
import TableContext from '../TableContext'
import styles from './Selection.module.scss'
import { useTableData } from '../UseTableData'
import { BulkAction } from './BulkAction'

const Selection = React.forwardRef(
  (
    {
      onChange,
      selected,
      bulkActions,
      selectBy,
      checkRowSelectable,
      className,
      hidden,
      alwaysSelected,
      bulkElement,
    },
    ref,
  ) => {
    const {
      state,
      setSelectionActivity,
      setSelection,
      deselectAll,
      setCheckRowSelectable,
      setAlwaysSelection,
    } = useContext(TableContext)
    const { totalItems } = state
    const { items, excludeMode } = state.selection
    const tableData = useTableData()

    useImperativeHandle(
      ref,
      () => ({
        get items() {
          return items
        },
      }),
      [items],
    )

    //For data changes we need to make sure that the selected items are
    // contained within the new data
    useEffect(() => {
      const newItems = items.filter(
        item => !!tableData.find(item2 => item === item2[selectBy]),
      )
      const newExcludeMode = tableData.length ? excludeMode : false
      onChange && onChange({ excludeMode, items: newItems })
      setSelection({ excludeMode: newExcludeMode, items: newItems })
      // the logic don't need items and excludeMode in deps array
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setSelection, onChange, tableData])

    useEffect(() => {
      selected && setSelection(selected)
    }, [selected, setSelection])

    useEffect(() => {
      alwaysSelected && setAlwaysSelection(new Set(alwaysSelected))
    }, [alwaysSelected, setAlwaysSelection])

    useEffect(() => {
      onChange && onChange(state.selection)
    }, [state.selection, onChange])

    useEffect(() => {
      setSelection({ excludeMode: false, items: [] })
    }, [setSelection, state.filters])

    useEffect(() => {
      setSelectionActivity(true, selectBy)
    }, [setSelectionActivity, selectBy])

    useEffect(() => {
      checkRowSelectable && setCheckRowSelectable(checkRowSelectable)
    }, [checkRowSelectable, setCheckRowSelectable])

    const renderActions = () => {
      return (
        <div className={styles.actionsContainer}>
          {bulkActions.map(
            ({ icon, onClick, subMenu, confirmDialogBody }, index) => (
              <BulkAction
                icon={icon}
                onClick={onClick}
                subMenu={subMenu}
                confirmDialogBody={confirmDialogBody}
                key={index}
              />
            ),
          )}
        </div>
      )
    }

    const renderBulkElement = () => {
      return <div className={styles.actionsContainer}>{bulkElement()}</div>
    }

    const handleDeselectAll = () => {
      deselectAll()
    }
    const renderBar =
      (!!bulkActions || !!bulkElement) && (excludeMode || !!items.length)
    const selectedCount =
      renderBar && (excludeMode ? totalItems - items.length : items.length)
    const classes = classNames(styles.selectionBar, className)

    if (hidden) return null

    return (
      <Animations.Scale isOpen={renderBar}>
        <Portal containerId={'table-selection-bar'}>
          <div className={classes}>
            <Checkbox indeterminate onChange={handleDeselectAll} />
            <div className={styles.countContainer}>
              <span className={styles.counter}>{selectedCount}</span>
              <span className={styles.counterLabel}>Items Selected</span>
            </div>
            {!!bulkActions && renderActions()}
            {!!bulkElement && renderBulkElement()}
          </div>
        </Portal>
      </Animations.Scale>
    )
  },
)

Selection.defaultProps = {
  onChange: () => {},
  selectBy: 'id',
}

Selection.propTypes = {
  /** Callback fire when selection changed. */
  onChange: propTypes.func,
  /** Selected items object. (For controlled selection). */
  selected: propTypes.arrayOf(
    propTypes.shape({
      items: propTypes.array,
      excludeMode: propTypes.bool,
    }),
  ),
  /** Table bulk actions. <br />
   *  Selection-Bar will be present when there are bulkActions. <br />
   *  <code>icon</code>             - icon for the action. <br />
   *  <code>label</code>            - label for the action icon.<br />
   *  <code>submenu</code>          - submenu for the action icon.<br />
   *  <code>confirmDialogBody</code>   - if pass confirmation dialog will show after click the action. <br />
   *  <code>onClick</code>          - callback fire when action click. <br />
   **/
  bulkActions: propTypes.arrayOf(
    propTypes.shape({
      icon: propTypes.node,
      subMenu: propTypes.arrayOf(
        propTypes.shape({
          icon: propTypes.node,
          label: propTypes.string,
          onClick: propTypes.func.isRequired,
          confirmDialogBody: propTypes.any,
        }),
      ),
      label: propTypes.string,
      onClick: propTypes.func,
      confirmDialogBody: propTypes.any,
    }),
  ),
  /** The selection evaluate by this prop. Set to the id field. */
  selectBy: propTypes.string,
  /** Check for each row if selection enabled <code>(row) => {}</code>. */
  checkRowSelectable: propTypes.func,
  /** Selection bar css customization. */
  className: propTypes.string,
  /** Whether selection bar is always hidden. */
  hidden: propTypes.bool,
  /** Items that are are always selected. (For controlled selection). */
  alwaysSelected: propTypes.arrayOf(propTypes.string, propTypes.number),
  bulkElement: propTypes.func,
}

export default Selection
