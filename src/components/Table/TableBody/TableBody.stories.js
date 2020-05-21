import React from 'react'
import { action } from '@storybook/addon-actions'
import { centerDecorator } from '../../../utils/storybook/decorators'
import { Chip } from '../../Chip'
import Table from '../Table'
import TableBody from './TableBody'

export default {
  title: 'Components/Table/TableBody',
  component: TableBody,
  decorators: [centerDecorator],
}

export const Basic = () => {
  const headers = [
    {
      field: 'username',
      content: 'user name',
    },
    {
      field: 'firstname',
      content: 'first name',
    },
    {
      field: 'lastname',
      content: 'lastname',
    },
    {
      field: 'location',
      content: 'location',
      columnRender: data => <Chip label={ data } />,
    },
    {
      field: 'date',
      content: 'date',
      hide: true,
    },
  ]

  const data = [
    {
      id: '1', username: 'Admin', firstname: 'Donte', lastname: 'Castaneda', location: 'Tel Aviv', date: '20/01/2019',
    },
    {
      id: '2', username: 'User', firstname: 'Cleo', lastname: 'Mcnamara', location: 'Jerusalem', date: '15/05/1998',
    },
    {
      id: '3', username: 'Admin', firstname: 'Rafael', lastname: 'Andersen', location: 'Eilat', date: '10/11/1989',
    },
    {
      id: '4', username: 'Operator', firstname: 'Neelam', lastname: 'Harris', location: 'Haifa', date: '04/12/2020',
    },
    {
      id: '5', username: 'Superator', firstname: 'Carole', lastname: 'Howe', location: 'Tzfat', date: '23/03/2009',
    },
  ]

  const rowActions = [
    { content: 'Delete', onClick: action('delete action clicked') },
    { content: 'Edit', onClick: action('edit action clicked') },
  ]

  const style = { width: '80%' }

  return (
    <Table style={ style }>
      <Table.TableHeader headers={ headers } />
      <Table.TableBody data={ data } rowActions={ rowActions } />
    </Table>
  )
}
