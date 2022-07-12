import React, { FC, ReactElement, useContext } from 'react'
import { Radio } from '../../../Radio'
import { Tooltip } from '../../../Tooltip'
import DynamicFilterContext from '../../store/DynamicFilterContext'
import { SortItemInterface } from '../../utils'
import styles from './DynamicFilterSortBase.module.scss'

interface DynamicFilterSortBaseProps {
  items: Array<SortItemInterface>
  otherProps: Record<string, any>
  elementKey: string
  onChange: (itemKey: string) => void
}

const DynamicFilterSortBase: FC<DynamicFilterSortBaseProps> = ({
  items,
  elementKey,
  otherProps,
  onChange,
}): ReactElement => {
  const { state } = useContext(DynamicFilterContext)
  const componentState = state.elementsState[elementKey]

  return (
    <div className={styles.filterSortBaseContainer} {...otherProps}>
      {items.map(({ id, value }) => (
        <div key={id} className={styles.filterSortBaseItem}>
          <Radio
            checked={componentState?.selectedItemId === id}
            onChange={() => onChange(id)}
            id={id}
            indeterminate={undefined}
            disabled={undefined}
            view={undefined}
            className={undefined}
          />
          <Tooltip overflowOnly placement='right' content={value}>
            <span className={styles.sortTitle}>{value}</span>
          </Tooltip>
        </div>
      ))}
    </div>
  )
}

export default DynamicFilterSortBase
