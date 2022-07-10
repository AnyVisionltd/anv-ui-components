import React, { useState } from 'react'
import DynamicFilter from '../DynamicFilter'
import { DateTimeVarientType } from '../utils'

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
    id: 'aaa',
    value: 'AAA',
  },
  {
    id: 'bbb',
    value: 'BBB',
  },
  {
    id: 'ccc',
    value: 'CCC',
  },
]

const listItems = [
  {
    id: 'bbbbff',
    value: 'dbbbdbbbdbbbdbbbdbbbdbbbdbbbdbbbdbbbdbbb',
    type: 'bbb',
  },
  { id: 'fdsfee', value: 'ddsdsadsadasd', type: 'bbb' },
  { id: 'fdsrwqf', value: 'ddsdsadsadasd', type: 'ccc' },
  { id: 'fdswe tf', value: 'ddsdsadsadasd', type: 'ccc' },
  { id: 'fdsdfyf', value: 'ddsdsadsadasd', type: 'ccc' },
  { id: 'fudghsf', value: 'ddsdsadsadasd', type: 'ccc' },
  { id: 'fiad;lksf', value: 'ddsdsadsadasd', type: 'ccc' },
  { id: 'fodcasssf', value: 'ddsdsadsadasd', type: 'bbb' },
  { id: 'fdpas3dsf', value: 'ddsdsadsadasd', type: 'bbb' },
  { id: 'fd45rgsf', value: 'ddsdsadsadasd', type: 'bbb' },
  { id: 'fdzt5sf', value: 'ddsdsadsadasd', type: 'bbb' },
  { id: 'fdgtre55sf', value: 'ddsdsadsadasd', type: 'bbb' },
  { id: 'fgfh89dhsf', value: 'ddsdsadsadasd', type: 'aaa' },
  { id: 'few12dsxf', value: 'ddsdsadsadasd', type: 'aaa' },
  { id: 'fddf44nsf', value: 'ddsdsadsadasd', type: 'aaa' },
  { id: 'fdjdsvv432sf', value: 'ddsdsadsadasd', type: 'aaa' },
  { id: 'fdfdsfhuuucsf', value: 'ddsdsadsadasd', type: 'aaa' },
  { id: 'fdfdfdsfaaamsf', value: 'ddsdsadsadasd', type: 'aaa' },
  { id: 'fdksdfsfdfrd696677f', value: 'ddsdsadsadasd', type: 'aaa' },
]

const sortItems = [
  { id: 'dfdsffdsfsf', value: 'name' },
  { id: 'dfdsffdsfsfww', value: 'type' },
]

const selectionItems = [
  { id: 'dfdsffdsfsf', value: 'name' },
  { id: 'dfdsffdsfsfww', value: 'type' },
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
          varientType={DateTimeVarientType.Duration}
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
          varientType={DateTimeVarientType.Time}
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
        <DynamicFilter.Slider elementKey='DateTime' title='Score' />
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
          elementKey='DateTime'
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
