import React, { useState, useMemo } from 'react'
import { boolean, text } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import { centerDecorator } from '../../utils/storybook/decorators'
import Table from './Table'
import { Chip } from "../Chip";

export default {
  title: 'Components/Table',
  component: Table,
  decorators: [centerDecorator],
}

export const Playground = () => {
  const headers = useMemo(() => [
    {
      field: 'username',
      content: 'user name',
      flexWidth: text('size user name', '20%'),
    },
    {
      field: 'firstname',
      content: 'first name',
      hide: boolean(' hide first name ', false),
    },
    {
      field: 'lastname',
      content: 'lastname',
    },
    {
      field: 'location',
      content: 'location',
      columnRender: data => <Chip label={ data }/>,
    },
    {
      field: 'date',
      content: 'date',
      hide: true
    }
  ],[])

  const data = useMemo(() => [
    { id: '1', username: 'Admin', firstname: 'Donte', lastname: 'Castaneda', location: 'Tel Aviv', date: '20/01/2019' },
    { id: '2', username: 'User', firstname: 'Cleo', lastname: 'Mcnamara', location: 'Jerusalem', date: '15/05/1998' },
    { id: '3', username: 'Admin', firstname: 'Rafael', lastname: 'Andersen', location: 'Eilat', date: '10/11/1989' },
    { id: '4', username: 'Operator', firstname: 'Neelam', lastname: 'Harris', location: 'Haifa', date: '04/12/2020' },
    { id: '5', username: 'Superator', firstname: 'Carole', lastname: 'Howe', location: 'Tzfat', date: '23/03/2009' },
  ],[])

  const rowActions = useMemo(() => [
    { content: 'Delete', onClick: action('delete action clicked') },
    { content: 'Edit', onClick: action('edit action clicked') }
  ],[])

  const style = { width: '80%' }
  return (
    <Table style={ style }>
      <Table.TableHeader
        headers={ headers }
        onHeaderCellClick={ action('header cell clicked') }
      />
      <Table.TableBody
        data={ data }
        rowHeight={ text('row height', '56px') }
        rowActions={ boolean('row actions', true ) ? rowActions : null }
      />
      {
        boolean('sortable', true)
        && <Table.Sortable onSortChange={ action('sort changed') } />
      }
    </Table>
  )
}
