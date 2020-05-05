import React from 'react'
import { centerDecorator } from '../../utils/storybook/decorators'
import Table from './Table'
import { TableHeader } from './TableHeader'

export default {
  title: 'Components/Table',
  component: Table,
  decorators: [centerDecorator],
}

const headers = [
  {
    field: 'img',
    content: 'Profile Image',
    disableSort: true,
    columnRender: () => <img alt="profile" />,
    size: '30%',
  },
  {
    field: 'username',
    content: () => <div>Username</div>,
    displayName: 'User Name', // for dynamic column dialog
  }, {
    field: 'firstname',
    content: 'First Name',
  }, {
    field: 'lastname',
    content: 'Last Name',
    customSort: (items) => items,
  },
  {
    field: 'hidden',
    content: 'Hidden',
    hide: true,
  }, {
    field: 'date',
    content: 'Date',
    type: 'date',
  },
]

export const Default = () => (
  <Table style={ { width: '100%' } }>
    <TableHeader headers={ headers } />
  </Table>
)

export const Sortable = () => (
  <Table style={ { width: '100%' } }>
    <TableHeader
      headers={ headers }
      isTableSortable
      sortBy={ { field: 'username' } }
    />
  </Table>
)
