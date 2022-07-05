import React, { FC, ReactElement, useContext, useEffect } from 'react'
import DynamicFilterContext from '../../store/DynamicFilterContext'
import { DynamicFilterSortProps } from '../../utils'
import DynamicFilterSortBase from '../DynamicFilterSortBase/DynamicFilterSortBase'

const DynamicFilterSort: FC<DynamicFilterSortProps> = ({
  items,
  elementKey,
  otherProps,
}): ReactElement => {
  const { actions } = useContext(DynamicFilterContext)

  useEffect(() => {
    if (items.length > 0) {
      actions.updateElementsState({
        [elementKey]: {
          selectedItemId: items[0].id,
        },
      })
    }
  }, [actions, items, elementKey])

  const onChange = (itemKey: string) => {
    actions.updateElementsState({
      [elementKey]: {
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

export default DynamicFilterSort
