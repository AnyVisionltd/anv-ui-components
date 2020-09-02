import React, { useMemo } from 'react'
import { action } from '@storybook/addon-actions'
import Table from '../Table'
import { Chip, Switch } from '../../../index'
import { ReactComponent as SunIcon } from '../../../assets/svg/Sun.svg'
import { ReactComponent as EyeEnabledIcon } from '../../../assets/svg/EyeEnabled.svg'
import { ReactComponent as EyeDisabledIcon } from '../../../assets/svg/EyeDisabled.svg'

export default {
  title: 'Components/Table',
  component: Table,
  subcomponents: {
    TableHeader: Table.Header,
    TableBody: Table.Body,
    TableSSF: Table.SSF,
    Sortable: Table.Sortable,
    Selection: Table.Selection,
    ColumnManagement: Table.ColumnManagement
  },
}

export const Basic = () => {
  const columns = useMemo(() => [
    {
      field: 'firstname',
      type: 'string',
      content: 'First Name',
      width: '200px',
      sortable: false,
      permanent: true,
    },
    {
      field: 'location',
      type: 'string',
      content: 'Location',
      manageable: false,
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
      field: 'active',
      content: 'Active',
      type: 'bool',
      filterable: false,
      columnRender: data => data ? 'True' : 'False',
      columnRenderHover: data => <Switch checked={ data } onClick={ e => e.stopPropagation() }/>
    },
    {
      field: 'hidden',
      content: 'Hidden',
      hide: true
    }
  ], [])

  const data = useMemo(() => [
    {
      id: '1',
      active: true,
      firstname: 'Donte',
      location: 'Tel Aviv',
      weather: 30,
    },
    {
      id: '2',
      active: false,
      firstname: 'Cleo',
      location: 'Jerusalem',
      weather: 15,
    },
    {
      id: '3',
      active: true,
      firstname: 'Rafael',
      location: 'Eilat',
      weather: 40,
    },
    {
      id: '4',
      active: false,
      firstname: 'Neelam',
      location: 'Haifa',
      weather: 25,
    },
    {
      id: '5',
      active: false,
      firstname: 'Carole',
      location: 'Tzfat',
      weather: 20,
    },
    {
      id: '6',
      active: false,
      firstname: 'Cruz de la Santa Rosalina Agnelia Rodriguez Cuellar Rene Reyes Vásquez Vega Castillo',
      location: 'Spain',
      weather: 41,
    },
  ], [])

  const rowActions = useMemo(() => [
    {
      label: 'Delete',
      onClick: action('delete action clicked')
    },
    {
      label: 'Edit',
      onClick: action('edit action clicked')
    },
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
      subMenu: [
        {
          icon: <SunIcon/>,
          label: 'action 3',
          onClick: action('bulk action 3'),
        },
        {
          icon: <EyeEnabledIcon/>,
          label: 'action 4',
          onClick: action('bulk action 4'),
        }
      ]
    }
  ]

  const style = { width: '100%', height: '450px' }
  return (
    <Table style={ style } selfControlled={ true }>
      <Table.SSF onChange={ action('SSF changed') }/>
      <Table.Header
        columns={ columns }
        onHeaderCellClick={ action('header cell clicked') }
      />
      <Table.Body
        data={ data }
        rowActions={ rowActions }
        onRowClick={ action('row clicked') }
      />
      <Table.Sortable onSortChange={ action('sort changed') }/>
      <Table.Selection bulkActions={ bulkActions } onChange={ action('selection changed') }/>
      <Table.ColumnManagement onChange={ action('columns changed') }/>
    </Table>
  )
}
