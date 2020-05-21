import React from 'react'
import { boolean, text } from '@storybook/addon-knobs'
import { centerDecorator } from '../../../utils/storybook/decorators'
import Table from '../Table'
import TableHeader from './TableHeader'

export default {
  title: 'Components/Table/TableHeader',
  component: TableHeader,
  decorators: [centerDecorator],
}

export const Basic = () => {
  const headers = [
    {
      field: 'img',
      content: 'profile image',
    },
    {
      field: 'username',
      content: 'user name',
      flexWidth: text('size user name', '20%'),
    }, {
      field: 'firstname',
      content: 'First Name',
      hide: boolean(' hide first name ', false),
    },
  ]

  const style = { width: '80%' }

  return (
    <Table style={ style }>
      <TableHeader
        headers={ headers }
      />
    </Table>
  )
}
