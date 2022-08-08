import { useMemo } from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import UserEvents from '@testing-library/user-event'
import Table from './Table'
import { Chip } from '../Chip'
import { Switch } from '../Switch'
import { ReactComponent as SunIcon } from '../../assets/svg/Sun.svg'

const expandableElTestId = 'expandable-el'
const expandableBtnTestId = 'expandable-btn'
const action = jest.fn()

jest.mock('react-virtualized-auto-sizer', () => ({ children }) =>
  children({ height: 800, width: '100%' }),
)

const RenderComp = () => {
  const columns = useMemo(
    () => [
      {
        field: 'firstname',
        type: 'string',
        content: 'First Name',
        width: '200px',
        sortable: false,
        permanent: true,
        triggerRowClick: false,
      },
      {
        field: 'location',
        type: 'string',
        content: 'Location',
        manageable: false,
        columnRender: data => <Chip label={data} />,
      },
      {
        field: 'weather',
        content: () => (
          <span style={{ display: 'flex', alignItems: 'center' }}>
            Weather
            <SunIcon style={{ marginLeft: '5px' }} />
          </span>
        ),
        columnRender: data => `${data}°`,
        label: 'Weather',
        type: 'number',
      },
      {
        field: 'active',
        content: 'Active',
        type: 'bool',
        filterable: false,
        columnRender: data => (data ? 'True' : 'False'),
        columnRenderHover: data => (
          <Switch checked={data} onClick={e => e.stopPropagation()} />
        ),
      },
      {
        field: 'hidden',
        content: 'Hidden',
        hide: true,
      },
    ],
    [],
  )

  const data = useMemo(
    () => [
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
        firstname: 'Hubert Blaine Wolfeschle Gelsteinhau Senber Gerdorff Sr',
        location: 'Eilat',
        weather: 40,
      },
      {
        id: '4',
        active: false,
        firstname: 'Neelam',
        location: 'Haifa',
        weather: 25,
        withoutAction: true,
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
        firstname: 'Eli',
        location: 'Yot',
        weather: 20,
      },
      {
        id: '7',
        active: false,
        firstname: 'Neomi',
        location: 'Eris',
        weather: 20,
      },
      {
        id: '8',
        active: false,
        firstname: 'Ran',
        location: 'Har',
        weather: 20,
      },
      {
        id: '9',
        active: false,
        firstname: 'Dan',
        location: 'Yehi',
        weather: 20,
      },
      {
        id: '11',
        active: false,
        firstname: 'Karl',
        location: 'Danon',
        weather: 20,
      },
      {
        id: '12',
        active: false,
        firstname: 'Yoni',
        location: 'Refa',
        weather: 20,
      },
      {
        id: '13',
        active: false,
        firstname: 'Micha',
        location: 'Sloti',
        weather: 20,
      },
    ],
    [],
  )

  const rowActions = useMemo(
    () => [
      {
        label: 'Delete',
        onClick: action('delete action clicked'),
        confirmDialogBody: 'Are you sure you want to delete this item?',
        hidden: row => !!row.withoutAction,
      },
      {
        label: 'Edit',
        onClick: action('edit action clicked'),
        confirmDialogBody: <h3>Are you sure you want to edit this item?</h3>,
        hidden: row => !!row.withoutAction,
      },
    ],
    [],
  )

  const style = { width: '100%', height: '450px' }

  const renderElement = row => (
    <div style={{ width: '100%', height: '100%' }}>{row.id}</div>
  )

  return (
    <Table style={style} selfControlled={true} isExpandableRow={true}>
      <Table.Header
        columns={columns}
        onHeaderCellClick={action('header cell clicked')}
      />
      <Table.Body
        data={data}
        rowActions={rowActions}
        onRowClick={action('row clicked')}
        renderExpandableElement={renderElement}
      />
    </Table>
  )
}

describe('Test the expand in the Table Component', () => {
  beforeEach(() => {
    render(<RenderComp />)
  })
  afterEach(cleanup)

  test('check that the expand arrow button exists', () => {
    const expandableElements = screen.queryAllByTestId(expandableBtnTestId)
    expandableElements.forEach(expandableEl => {
      expect(expandableEl).toBeInTheDocument()
    })
  })

  test('check that the expand arrow button open the expendEl', () => {
    const expandableElements = screen.queryAllByTestId(expandableBtnTestId)
    expect(expandableElements.length).toBeGreaterThan(0)
    UserEvents.click(expandableElements[0])
    const expandableEl = screen.queryByTestId(expandableElTestId)
    expect(expandableEl).toBeInTheDocument()
  })
})
