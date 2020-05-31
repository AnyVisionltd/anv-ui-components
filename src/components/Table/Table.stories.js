import React, { useMemo } from 'react'
import { boolean, text } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import { centerDecorator } from '../../utils/storybook/decorators'
import Table from './Table'
import { Chip } from '../Chip'
import { ReactComponent as SunIcon } from '../../assets/svg/Sun.svg'

export default {
  title: 'Components/Table',
  component: Table,
  decorators: [centerDecorator],
}

export const Playground = () => {
  const headers = useMemo(() => [
    {
      field: 'firstname',
      content: 'First Name',
      hide: boolean(' hide first name ', false),
    },
    {
      field: 'lastname',
      content: 'Last Name',
    },
    {
      field: 'role',
      content: 'Role',
      flexWidth: text('size role', '20%'),
    },
    {
      field: 'location',
      content: 'Location',
      columnRender: data => <Chip label={ data } />,
    },
    {
      field: 'weather',
      content: () => <span
        style={ { display: 'flex', alignItems: 'center' } }
      >
        Weather
        <SunIcon style={ { marginLeft: '5px' } }/>
      </span>,
      label: 'Weather',
      type: 'number'
    }
  ], [])

  const data = useMemo(() => [
    {
      id: '1',
      role: 'Admin',
      firstname: 'Donte',
      lastname: 'Castaneda',
      location: 'Tel Aviv',
      weather: '30°',
      date: '20/01/2019',
    },
    {
      id: '2',
      role: 'User',
      firstname: 'Cleo',
      lastname: 'Mcnamara',
      location: 'Jerusalem',
      weather: '15°',
      date: '15/05/1998',
    },
    {
      id: '3',
      role: 'Admin',
      firstname: 'Rafael',
      lastname: 'Andersen',
      location: 'Eilat',
      weather: '40°',
      date: '10/11/1989',
    },
    {
      id: '4',
      role: 'Operator',
      firstname: 'Neelam',
      lastname: 'Harris',
      location: 'Haifa',
      weather: '25°',
      date: '04/12/2020',
    },
    {
      id: '5',
      role: 'Superator',
      firstname: 'Carole',
      lastname: 'Howe',
      location: 'Tzfat',
      weather: '20°',
      date: '23/03/2009',
    },
  ], [])

  const rowActions = useMemo(() => [
    { content: 'Delete', onClick: action('delete action clicked') },
    { content: 'Edit', onClick: action('edit action clicked') },
  ], [])

  const style = { width: '80%' }
  return (
    <Table style={ style } controlled={ false }>
      {
        boolean('SSF', true)
        && <Table.SSF onChange={ action('SSF changed') }/>
      }
      <Table.Header
        headers={ headers }
        onHeaderCellClick={ action('header cell clicked') }
      />
      <Table.Body
        data={ data }
        rowHeight={ text('row height', '56px') }
        rowActions={ boolean('row actions', true) ? rowActions : null }
      />
      {
        boolean('sortable', true)
        && <Table.Sortable onSortChange={ action('sort changed') } />
      }
    </Table>
  )
}
