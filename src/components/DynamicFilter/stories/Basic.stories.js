import React, { useState } from 'react'
import DynamicFilter from '../DynamicFilter'
import { DateTimeVariantType } from '../utils'

export default {
  title: 'Content/DynamicFilter',
  component: DynamicFilter,
  subcomponents: {
    DateTime: DynamicFilter.DateTime,
    ListFilter: DynamicFilter.ListFilter,
    Selection: DynamicFilter.Selection,
    Slider: DynamicFilter.Slider,
    Sort: DynamicFilter.Sort,
  },
}

const listFilterItems = [
  {
    id: 'Face',
    value: 'Face',
  },
  {
    id: 'Body',
    value: 'Body',
  },
  {
    id: 'Person',
    value: 'Person',
  },
]

const listItems = [
  { id: 'subject 1', value: 'subject 1', type: 'Face' },
  { id: 'subject 2', value: 'subject 2', type: 'Body' },
  { id: 'subject 3', value: 'subject 3', type: 'Body' },
  { id: 'subject 4', value: 'subject 4', type: 'Face' },
  { id: 'subject 5', value: 'subject 5', type: 'Body' },
  { id: 'subject 6', value: 'subject 6', type: 'Body' },
  { id: 'subject 7', value: 'subject 7', type: 'Face' },
  { id: 'subject 8', value: 'subject 8', type: 'Face' },
  { id: 'subject 9', value: 'subject 9', type: 'Face' },
  { id: 'subject 10', value: 'subject 10', type: 'Face' },
  { id: 'subject 11', value: 'subject 11', type: 'Body' },
  { id: 'subject 12', value: 'subject 12', type: 'Body' },
  { id: 'subject 13', value: 'subject 13', type: 'Body' },
  { id: 'subject 14', value: 'subject 14', type: 'Face' },
  { id: 'subject 15', value: 'subject 15', type: 'Person' },
  { id: 'subject 16', value: 'subject 16', type: 'Person' },
  { id: 'subject 17', value: 'subject 17', type: 'Face' },
  { id: 'subject 18', value: 'subject 18', type: 'Person' },
]

const sortItems = [
  { id: 'name', value: 'name' },
  { id: 'type', value: 'type' },
]

const selectionItems = [
  { id: 'name', value: 'name' },
  { id: 'type', value: 'type' },
]

const loadDataOffset = 10

const style = { width: '100%', height: '400px' }

export const Basic = () => {
  const [itemsToShow, setItemsToShow] = useState(
    listItems.slice(0, loadDataOffset),
  )
  const [isLoading, setIsLoading] = useState(false)
  const [searchFilter, setSearchFilter] = useState('')

  const onApply = response => {
    console.log('onApply response', response)
  }

  const onClose = () => {
    console.log('onClose')
  }

  const getFilteredItems = (itemsToFilter, search) => {
    return itemsToFilter.filter(item =>
      item.id.toLowerCase().includes(search.toLowerCase()),
    )
  }

  const onLoadMoreData = () => {
    setIsLoading(true)
    setItemsToShow(prev => {
      const filteredItems = getFilteredItems(listItems, searchFilter)
      return filteredItems.slice(0, prev.length + loadDataOffset)
    })
    setIsLoading(false)
  }

  const handleOnChange = ({ search }) => {
    setSearchFilter(search)
    setIsLoading(true)
    const filtered = getFilteredItems(listItems, search)
    setItemsToShow(filtered)
    setIsLoading(false)
  }

  return (
    <div style={style}>
      <DynamicFilter
        title={'Basic'}
        onApply={onApply}
        onClose={onClose}
        classname={'customClassname'}
      >
        <DynamicFilter.Sort items={sortItems} elementKey={'sorts'} />
        <DynamicFilter.ListFilter
          elementKey='ListFilter'
          items={itemsToShow}
          onLoadMoreData={onLoadMoreData}
          unControlled={true}
          onChange={handleOnChange}
          totalItems={listItems.length}
          isLoading={isLoading}
        />
      </DynamicFilter>
    </div>
  )
}

export const Sort = () => {
  const onApply = response => {
    console.log('onApply response', response)
  }

  const onClose = () => {
    console.log('onClose')
  }

  return (
    <div style={style}>
      <DynamicFilter title={'Sort'} onApply={onApply} onClose={onClose}>
        <DynamicFilter.Sort items={sortItems} elementKey={'sorts'} />
      </DynamicFilter>
    </div>
  )
}

export const Selection = () => {
  const onApply = response => {
    console.log('onApply response', response)
  }

  const onClose = () => {
    console.log('onClose')
  }

  return (
    <div style={style}>
      <DynamicFilter title={'Selection'} onApply={onApply} onClose={onClose}>
        <DynamicFilter.Selection
          items={selectionItems}
          elementKey={'selection'}
        />
      </DynamicFilter>
    </div>
  )
}

export const MultiSelection = () => {
  const onApply = response => {
    console.log('onApply response', response)
  }

  const onClose = () => {
    console.log('onClose')
  }

  return (
    <div style={style}>
      <DynamicFilter title={'Selection'} onApply={onApply} onClose={onClose}>
        <DynamicFilter.Selection
          items={selectionItems}
          elementKey={'first-selection'}
        />
        <DynamicFilter.Selection
          items={selectionItems}
          elementKey={'second-selection'}
        />
      </DynamicFilter>
    </div>
  )
}

export const DateTime = () => {
  const onApply = response => {
    console.log('onApply response', response)
  }

  const onClose = () => {
    console.log('onClose')
  }

  return (
    <div style={style}>
      <DynamicFilter title={'DateTime'} onApply={onApply} onClose={onClose}>
        <DynamicFilter.DateTime
          elementKey='DateTime'
          title='Event Timestamp '
        />
      </DynamicFilter>
    </div>
  )
}

export const DateTimeOnlyDuration = () => {
  const onApply = response => {
    console.log('onApply response', response)
  }

  const onClose = () => {
    console.log('onClose')
  }

  return (
    <div style={style}>
      <DynamicFilter
        title={'DateTime Duration'}
        onApply={onApply}
        onClose={onClose}
      >
        <DynamicFilter.DateTime
          variantType={DateTimeVariantType.Duration}
          elementKey='DateTime'
          title='Event Timestamp '
        />
      </DynamicFilter>
    </div>
  )
}

export const DateTimeOnlyTime = () => {
  const onApply = response => {
    console.log('onApply response', response)
  }

  const onClose = () => {
    console.log('onClose')
  }

  return (
    <div style={style}>
      <DynamicFilter
        title={'DateTime Time'}
        onApply={onApply}
        onClose={onClose}
      >
        <DynamicFilter.DateTime
          variantType={DateTimeVariantType.Time}
          elementKey='DateTime'
          title='Event Timestamp'
        />
      </DynamicFilter>
    </div>
  )
}

export const SingleSlider = () => {
  const onApply = response => {
    console.log('onApply response', response)
  }

  const onClose = () => {
    console.log('onClose')
  }

  return (
    <div style={style}>
      <DynamicFilter
        title={'Single Slider'}
        onApply={onApply}
        onClose={onClose}
      >
        <DynamicFilter.Slider elementKey='SingleSlider' title='Score' />
      </DynamicFilter>
    </div>
  )
}

export const DualSlider = () => {
  const onApply = response => {
    console.log('onApply response', response)
  }

  const onClose = () => {
    console.log('onClose')
  }

  return (
    <div style={style}>
      <DynamicFilter title={'Dual Slider'} onApply={onApply} onClose={onClose}>
        <DynamicFilter.Slider
          elementKey='DualSlider'
          title='Score'
          defaultValue={[4, 8]}
          min={0}
          max={10}
        />
      </DynamicFilter>
    </div>
  )
}

export const ControlledListFilter = () => {
  const onApply = response => {
    console.log('onApply response', response)
  }

  const onClose = () => {
    console.log('onClose')
  }

  return (
    <div style={style}>
      <DynamicFilter
        title={'Controlled ListFilter'}
        onApply={onApply}
        onClose={onClose}
      >
        <DynamicFilter.ListFilter
          elementKey='ListFilter'
          items={listItems}
          unControlled={false}
        />
      </DynamicFilter>
    </div>
  )
}

export const ControlledListWithFilters = () => {
  const onApply = response => {
    console.log('onApply response', response)
  }

  const onClose = () => {
    console.log('onClose')
  }

  return (
    <div style={style}>
      <DynamicFilter
        title={'Controlled ListFilter with filters'}
        onApply={onApply}
        onClose={onClose}
      >
        <DynamicFilter.ListFilter
          elementKey='ListFilter'
          items={listItems}
          unControlled={false}
          filterItems={listFilterItems}
        />
      </DynamicFilter>
    </div>
  )
}
