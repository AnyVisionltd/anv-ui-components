import React, { useMemo } from 'react'
import { action } from '@storybook/addon-actions'
import { centerDecorator } from '../../utils/storybook/decorators'
import Table from './Table'
import TableHeader from "./TableHeader/TableHeader"
import TableBody from "./TableBody/TableBody"
import TableSSF from "./TableSSF/TableSSF"
import Sortable from "./Sortable/Sortable"
import Selection from "./Selection/Selection"
import { Chip } from '../Chip'
import { ReactComponent as SunIcon } from '../../assets/svg/Sun.svg'

export default {
  title: 'Components/Table',
  component: Table,
  subcomponents: { TableHeader, TableBody, TableSSF, Sortable, Selection },
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

  const style = { width: '80%' }
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
	  <Table.Selection onChange={ action('selection changed') }/>
    </Table>
  )
}
