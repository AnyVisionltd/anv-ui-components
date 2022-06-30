import React, { useState } from 'react'
import DynamicFilter from '../DynamicFilter'

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
    <DynamicFilter title={'Acknowledge'} onApply={onApply} onClose={onClose} />
  )
}
