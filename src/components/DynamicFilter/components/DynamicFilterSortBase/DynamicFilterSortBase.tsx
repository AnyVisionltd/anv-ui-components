import React, { FC, ReactElement, useContext } from 'react'
import { Radio } from '../../../Radio'
import { Tooltip } from '../../../Tooltip'
import DynamicFilterContext from '../../store/DynamicFilterContext'
import { SortItemInterface } from '../../utils'
import styles from './DynamicFilterSortBase.module.scss'

interface DynamicFilterSortBaseProps {
  items: Array<SortItemInterface>
  otherProps?: Record<string, any>
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
    <div className={styles.filterSortBaseContainer}>
      {items.map(({ key, title }) => (
        <div key={key} className={styles.filterSortBaseItem} {...otherProps}>
          <Radio
            checked={componentState?.selectedItemId === key}
            onChange={() => onChange(key)}
            id={key}
            indeterminate={undefined}
            disabled={undefined}
            view={undefined}
            className={undefined}
          />
          <Tooltip overflowOnly placement='right' content={title}>
            <span className={styles.sortTitle}>{title}</span>
          </Tooltip>
        </div>
      ))}
    </div>
  )
}

export default DynamicFilterSortBase
