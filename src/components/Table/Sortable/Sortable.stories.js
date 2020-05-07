import React from 'react'
import { centerDecorator } from '../../../utils/storybook/decorators'
import Sortable from './Sortable'
import Table from '../Table'

export default {
  title: 'Components/Table/Sortable',
  component: Sortable,
  decorators: [centerDecorator],
}

const headers = [
  {
    field: 'username',
    content: () => 'User Name',
  }, {
    field: 'firstname',
    content: 'First Name',
  }, {
    field: 'lastname',
    content: 'Last Name',
  },
  {
    field: 'date',
    content: 'Date',
  },
]

export const Basic = () => (
  <Table
    style={ { width: '80%' } }
  >
    <Table.TableHeader headers={ headers } />
    <Table.Sortable />
  </Table>
)

export const withDefaultSort = () => (
  <Table
    style={ { width: '80%' } }
  >
    <Table.TableHeader
      headers={ headers }
    />
    <Table.Sortable
      defaultSortBy={ { field: 'username', order: 'asc' } }
    />
  </Table>
)
