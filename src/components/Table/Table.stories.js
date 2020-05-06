import React from 'react'
import { centerDecorator } from '../../utils/storybook/decorators'
import Table from './Table'
import TableHeader from './TableHeader/TableHeader'

export default {
  title: 'Components/Table/Table',
  component: Table,
  decorators: [centerDecorator],
}

const headers = [
  {
    field: 'username',
    content: () => <div>Username</div>,
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

export const Default = () => (
  <Table style={ { width: '80%' } }>
    <TableHeader headers={ headers } />
  </Table>
)
