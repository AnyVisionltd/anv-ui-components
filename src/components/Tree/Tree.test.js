import React from 'react'
import { render, fireEvent, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import languageService from '../../services/language'
import Tree from './Tree'

const getTranslation = path => languageService.getTranslation(`${path}`)

jest.mock('react-virtualized-auto-sizer', () => ({ children }) =>
  children({ height: 480, width: 100 }),
)

const virtualizedTree = jest.requireActual('react-vtree')
virtualizedTree.recomputeTree = jest.fn()

const treeNodes = [
  {
    key: '1',
    label: 'Cities',
    children: [
      {
        label: 'Jerusalem',
        key: '11',
      },
      {
        label: 'Eilat',
        key: '12',
      },
    ],
  },
  {
    key: '2',
    label: 'Countries',
    children: [
      {
        label: 'Israel',
        key: '21',
      },
    ],
  },
]

describe('<Tree/>', () => {
  test('initial conditions', async () => {
    const placeholder = 'Search an item'
    const { getByRole, getAllByRole, getByPlaceholderText } = render(
      <Tree nodes={treeNodes} placeholder={placeholder} />,
    )

    expect(getByRole('textbox').value).toBe('')
    expect(getByPlaceholderText(placeholder)).toBeInTheDocument()

    const checkboxes = await waitFor(() => getAllByRole('checkbox'))
    // Initially, only the parent nodes are shown and every parent has 2 checkboxes:
    // one to select and the second is to open the node's content. +1 is for bulk select checkbox
    const expectedCheckboxesAmount = treeNodes.length * 2 + 1
    expect(checkboxes.length).toBe(expectedCheckboxesAmount)
  })

  test('`select all` checkbox should be checked when all nodes are selected', () => {
    const onSelect = jest.fn()
    const { getAllByRole } = render(
      <Tree nodes={treeNodes} onSelect={onSelect} />,
    )

    const checkboxes = getAllByRole('checkbox')
    const bulkSelectCheckbox = checkboxes[0]

    userEvent.click(bulkSelectCheckbox)
    expect(onSelect).toBeCalled()
  })

  test('On search should be called when user types in search field', () => {
    const onSearch = jest.fn()
    const { getByRole } = render(<Tree nodes={treeNodes} onSearch={onSearch} />)

    const searchInput = getByRole('textbox')

    fireEvent.change(searchInput, { target: { value: 'something' } })
    expect(onSearch).toBeCalled()
  })

  test('no results indication should appear when user types a search query that doesnt match any item in tree', async () => {
    const { getByRole, getByText } = render(<Tree nodes={treeNodes} />)

    const searchInput = getByRole('textbox')

    await act(async () =>
      fireEvent.change(searchInput, {
        target: {
          value: 'something that mismatches all current items in tree',
        },
      }),
    )
    await waitFor(() =>
      expect(getByText(getTranslation('noResultsFound'))).toBeInTheDocument(),
    )
    await waitFor(() =>
      expect(getByText(getTranslation('clearSearch'))).toBeInTheDocument(),
    )
  })

  test('all nodes should be selected if selectedKeys are for all keys', async () => {
    // Choosing the keys of the main roots of tree so their children will be selected too
    const selectedKeys = treeNodes.map(({ key }) => key)
    const { getAllByRole } = render(<Tree selectedKeys={selectedKeys} />)
    const checkboxes = getAllByRole('checkbox')
    const bulkSelectCheckbox = checkboxes[0]
    console.log(bulkSelectCheckbox)

    await waitFor(() => expect(bulkSelectCheckbox.checked).toBe(true))
  })

  test('search input should not appear when isSearchable is false', () => {
    const { getByRole } = render(<Tree isSearchable={false} />)
    expect(() => getByRole('textbox')).toThrow()
  })

  test('bulk actions area should not appear when isBulkActionEnabled is false', () => {
    const { getByText } = render(<Tree isBulkActionEnabled={false} />)
    expect(() => getByText(getTranslation('expandAll'))).toThrow()
  })
})
