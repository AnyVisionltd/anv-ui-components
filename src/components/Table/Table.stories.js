import React, { useMemo } from 'react'
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

export const Basic = () => {
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

  const data = useMemo(() => [
    {
	  id: '1',
	  role: 'Admin',
	  firstname: 'Donte',
	  location: 'Tel Aviv',
	  weather: 30,
	  date: new Date(2020, 1),
    },
    {
	  id: '2',
	  role: 'User',
	  firstname: 'Cleo',
	  location: 'Jerusalem',
	  weather: 15,
	  date: new Date(2020, 2),
    },
    {
	  id: '3',
	  role: 'Admin',
	  firstname: 'Rafael',
	  location: 'Eilat',
	  weather: 40,
	  date: new Date(2020, 3),
    },
    {
	  id: '4',
	  role: 'Operator',
	  firstname: 'Neelam',
	  location: 'Haifa',
	  weather: 25,
	  date: new Date(2020, 4),
    },
    {
	  id: '5',
	  role: 'Superator',
	  firstname: 'Carole',
	  location: 'Tzfat',
	  weather: 20,
	  date: new Date(2020, 5),
    },
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

  const style = { width: '80%', height: '300px' }
  return (
    <Table style={ style } selfControlled={ true }>
	  <Table.SSF onChange={ action('SSF changed') }/>
	  <Table.Header
        headers={ headers }
        onHeaderCellClick={ action('header cell clicked') }
	  />
	  <Table.Body
        data={ data }
        rowActions={ rowActions }
	  />
	  <Table.Sortable onSortChange={ action('sort changed') }/>
	  <Table.Selection bulkActions={ bulkActions } onChange={ action('selection changed') }/>
    </Table>
  )
}
