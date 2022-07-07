import React, { useState } from 'react'
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

const items = [
  {
    id: 'fdsfq',
    value: 'dbbbdbbbdbbbdbbbdbbbdbbbdbbbdbbbdbbbdbbb',
    type: 'bbb',
  },
  { id: 'fdsfw', value: 'ddsdsadsadasd', type: 'bbb' },
  { id: 'fdsfe', value: 'ddsdsadsadasd', type: 'bbb' },
  { id: 'fdsrf', value: 'ddsdsadsadasd', type: 'ccc' },
  { id: 'fdstf', value: 'ddsdsadsadasd', type: 'ccc' },
  { id: 'fdsyf', value: 'ddsdsadsadasd', type: 'ccc' },
  { id: 'fudsf', value: 'ddsdsadsadasd', type: 'ccc' },
  { id: 'fiadsf', value: 'ddsdsadsadasd', type: 'ccc' },
  { id: 'fodssf', value: 'ddsdsadsadasd', type: 'bbb' },
  { id: 'fdpdsf', value: 'ddsdsadsadasd', type: 'bbb' },
  { id: 'fdgsf', value: 'ddsdsadsadasd', type: 'bbb' },
  { id: 'fdzsf', value: 'ddsdsadsadasd', type: 'bbb' },
  { id: 'fdsf', value: 'ddsdsadsadasd', type: 'bbb' },
  { id: 'fdhsf', value: 'ddsdsadsadasd', type: 'aaa' },
  { id: 'fdsxf', value: 'ddsdsadsadasd', type: 'aaa' },
  { id: 'fdnsf', value: 'ddsdsadsadasd', type: 'aaa' },
  { id: 'fdjsf', value: 'ddsdsadsadasd', type: 'aaa' },
  { id: 'fdcsf', value: 'ddsdsadsadasd', type: 'aaa' },
  { id: 'fdmsf', value: 'ddsdsadsadasd', type: 'aaa' },
  { id: 'fdksf', value: 'ddsdsadsadasd', type: 'aaa' },
]

export const Basic = () => {
  const [itemsToShow, SetItemsToShow] = useState(items.slice(0, 10))
  const [isLoading, SetIsLoading] = useState(false)
  const onApply = res => {}

  const onClose = () => {}

  return (
    <div className={styles.marginFlexContainer}>
      <DynamicFilter title={'Acknowledge'} onApply={onApply} onClose={onClose}>
        <DynamicFilter.Sort
          items={[
            {
              id: 'dds',
              value: 'fdsf dfdsfdfdsfdfdsfd',
            },
            { id: 'dssasdds', value: 'dssasddsdssasdds' },
          ]}
          elementKey={'sorts'}
        />
        <DynamicFilter.ListFilter
          elementKey='ListFilter'
          items={itemsToShow}
          onLoadMoreData={() => {
            SetItemsToShow(prev => [
              ...prev,
              ...items.slice(prev.length, prev.length + 10),
            ])
          }}
          unControlled={true}
          onChange={filterBy => console.log(filterBy)}
          totalItems={items.length}
          isLoading={isLoading}
          // filterItems={[
          //   {
          //     id: 'aaa',
          //     value: 'AAA',
          //   },
          //   {
          //     id: 'bbb',
          //     value: 'BBB',
          //   },
          //   {
          //     id: 'ccc',
          //     value: 'CCC',
          //   },
          // ]}
        />
      </DynamicFilter>
    </div>
  )
}
