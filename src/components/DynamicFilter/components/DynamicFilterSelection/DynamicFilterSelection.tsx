import React, { FC, ReactElement, useContext, useEffect } from 'react'
import DynamicFilterContext from '../../store/DynamicFilterContext'
import { SortItemInterface } from '../../utils'
import DynamicFilterSortBase from '../DynamicFilterSortBase/DynamicFilterSortBase'

interface DynamicFilterSelectionProps {
  /** Selection items - { id, value }.*/
  items: Array<SortItemInterface>
  /** The key of the component, On - 'onApply' - the key contains the Result data.*/
  elementKey: string
  /** Props for the Selection parent element. */
  otherProps?: Record<string, any>
  /** Default value, if not set the default is the first item */
  defaultSelectedId?: string
}

const DynamicFilterSelection: FC<DynamicFilterSelectionProps> = ({
  items,
  elementKey,
  otherProps = {},
  defaultSelectedId,
}): ReactElement => {
  const { actions } = useContext(DynamicFilterContext)

  useEffect(() => {
    if (items.length > 0) {
      actions.updateElementsState({
        key: elementKey,
        value: {
          selectedItemId: defaultSelectedId || items[0].id,
        },
      })
    }
  }, [actions, items, elementKey, defaultSelectedId])

  const onChange = (itemKey: string) => {
    actions.updateElementsState({
      key: elementKey,
      value: {
        selectedItemId: itemKey,
      },
    })
  }

  return (
    <DynamicFilterSortBase
      items={items}
      elementKey={elementKey}
      otherProps={otherProps}
      onChange={onChange}
    />
  )
}

export default DynamicFilterSelection
