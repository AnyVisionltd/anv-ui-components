import React, { useCallback, useMemo, useState } from 'react'
import { action } from '@storybook/addon-actions'
import { centerDecorator } from '../../utils/storybook/decorators'
import Table from './Table'
import { Chip } from '../Chip'
import { ReactComponent as SunIcon } from '../../assets/svg/Sun.svg'
import { ReactComponent as EyeEnabledIcon } from '../../assets/svg/EyeEnabled.svg'
import { ReactComponent as EyeDisabledIcon } from '../../assets/svg/EyeDisabled.svg'

export default {
  title: 'Components/Table',
  component: Table,
  subcomponents: {
    TableHeader: Table.Header,
    TableBody: Table.Body,
    TableSSF: Table.SSF,
    Sortable: Table.Sortable,
    Selection: Table.Selection
  },
  decorators: [centerDecorator],
}

export const RemoteDataTable = () => {

  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const totalItems = 50

  const loadMoreItems = useCallback(() => {
    setIsLoading(true)
    const a = Array.from({ length: 10 }, (_, index) => ({
	  id: data.length + index,
	  role: 'Admin',
	  firstname: 'Donte',
	  location: 'Tel Aviv',
	  weather: 30,
	  date: new Date(2020, 1),
    }))

    setTimeout(() => {
	  const newItems = [...data, ...a]
	  setData(newItems)
	  setIsLoading(false)
    }, 2500)
  }, [data])

  const headers = useMemo(() => [
    {
	  field: 'firstname',
	  content: 'First Name',
	  flexWidth: '200px',
    },
    {
	  field: 'role',
	  content: 'Role',
    },
    {
	  field: 'location',
	  content: 'Location',
	  columnRender: data => <Chip label={ data }/>,
    },
    {
	  field: 'weather',
	  content: () => <span
        style={ { display: 'flex', alignItems: 'center' } }
	  >
        Weather
        <SunIcon style={ { marginLeft: '5px' } }/>
      </span>,
	  columnRender: data => `${data}°`,
	  label: 'Weather',
	  type: 'number'
    },
    {
	  field: 'date',
	  content: 'Date',
	  type: 'date',
	  columnRender: data => data.toISOString().slice(0, 10)
    }

  ], [])

  const rowActions = useMemo(() => [
    { content: 'Delete', onClick: action('delete action clicked') },
    { content: 'Edit', onClick: action('edit action clicked') },
  ], [])

  const bulkActions = [
    {
      icon: <SunIcon/>,
      label: 'action 1',
      onClick: action('bulk action 1'),
    },
    {
      icon: <EyeEnabledIcon/>,
      label: 'action 2',
      onClick: action('bulk action 2'),
    },
    {
      icon: <EyeDisabledIcon/>,
      label: 'action 3',
      onClick: action('bulk action 3')
    }
  ]

  const onTableChange = useCallback(({ filters, sort }) => {
    console.log('table params changed add debounce')
  }, [])

  const style = { width: '80%', height: '400px' }

  return (
    <Table style={ style } onChange={ onTableChange }>
	  <Table.SSF/>
	  <Table.Header headers={ headers }/>
	  <Table.Body
        totalItems={ totalItems }
        data={ data }
        rowActions={ rowActions }
        isLoading={ isLoading }
        loadMoreData={ loadMoreItems }
	  />
	  <Table.Sortable/>
	  <Table.Selection bulkActions={ bulkActions }/>
    </Table>
  )
}
