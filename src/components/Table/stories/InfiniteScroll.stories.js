import React, { useCallback, useMemo, useState } from 'react'
import Table from '../Table'
import { Chip } from '../../Chip'

export default {
  title: 'Components/Table',
  component: Table,
  subcomponents: {
    TableHeader: Table.Header,
    TableBody: Table.Body,
    TableSSF: Table.SSF,
    Sortable: Table.Sortable,
    Selection: Table.Selection
  },
}

export const InfiniteScroll = () => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const totalItems = 50

  const loadMoreItems = useCallback(() => {
    setIsLoading(true)
    const a = Array.from({ length: 10 }, (_, index) => ({
      id: data.length + index,
      role: 'Admin',
      firstname: 'Donte',
      location: 'Tel Aviv',
      date: new Date(2020, 1),
    }))

    setTimeout(() => {
      const newItems = [...data, ...a]
      setData(newItems)
      setIsLoading(false)
    }, 2500)
  }, [data])

  const headers = useMemo(() => [
    {
      field: 'firstname',
      content: 'First Name',
      width: '200px',
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
      field: 'date',
      content: 'Date',
      type: 'date',
      columnRender: data => data.toISOString().slice(0, 10)
    }

  ], [])

  const onTableChange = useCallback(({ filters, sort }) => {
    // TODO add server mock for filters and sort
  }, [])

  const style = { width: '100%', height: '400px' }

  return (
    <Table style={ style } onChange={ onTableChange }>
      <Table.Header headers={ headers }/>
      <Table.Body
        totalItems={ totalItems }
        data={ data }
        isLoading={ isLoading }
        loadMoreData={ loadMoreItems }
      />
    </Table>
  )
}
