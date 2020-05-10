import React from 'react'
import { boolean } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import { centerDecorator } from '../../utils/storybook/decorators'
import Table from './Table'

export default {
  title: 'Components/Table',
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

export const Playground = () => {
  const style = { width: '80%' }
  return (
    <Table style={ style }>
      <Table.TableHeader
        headers={ headers }
        onHeaderCellClick={ action('header cell clicked') }
      />
      {
        boolean('sortable', true)
        && <Table.Sortable onSortChange={ action('sort changed') } />
      }
    </Table>
  )
}
