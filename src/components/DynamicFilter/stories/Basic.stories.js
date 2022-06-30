import React from 'react'
import DynamicFilter from '../DynamicFilter'
import styles from '../../../storybook/index.module.scss'

export default {
  title: 'Content/DynamicFilter',
  component: DynamicFilter,
  subcomponents: {
    DateTime: DynamicFilter.DateTime,
    InfiniteListFilter: DynamicFilter.InfiniteListFilter,
    ListFilter: DynamicFilter.ListFilter,
    Selection: DynamicFilter.Selection,
    Slider: DynamicFilter.Slider,
    Sort: DynamicFilter.Sort,
  },
}

export const Basic = () => {
  const onApply = res => {}

  const onClose = () => {}

  return (
    <div className={styles.marginFlexContainer}>
      <DynamicFilter
        title={'Acknowledge'}
        onApply={onApply}
        onClose={onClose}
      />
    </div>
  )
}
