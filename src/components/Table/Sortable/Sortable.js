import React, { useContext, useEffect } from 'react'
import propTypes from 'prop-types'
import TableContext from '../TableContext'

const Sortable = ({
  sortBy,
  defaultSortBy,
  onSortChange,
}) => {
  const { state, setSortable, setSortBy } = useContext(TableContext)
  const { sortable, sortBy: contextSortBy } = state.sort

  useEffect(() => {
    if (sortable) {
      onSortChange(contextSortBy)
    }
  }, [onSortChange, sortable, contextSortBy])

  useEffect(() => {
    setSortable(true)
  }, [setSortable])

  useEffect(() => {
    defaultSortBy && setSortBy(defaultSortBy)
    // because we want defaultSortBy only on mount
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    sortBy && setSortBy(sortBy)
  }, [setSortBy, sortBy])

  return <></>
}

Sortable.defaultProps = {
  onSortChange: () => {},
}

Sortable.propTypes = {
  /** Set the Sort by. use for controlled sort */
  sortBy: propTypes.shape({
    field: propTypes.string,
    order: propTypes.oneOf(['asc', 'desc']),
  }),
  /** Set the default sort by. use for uncontrolled sort */
  defaultSortBy: propTypes.shape({
    field: propTypes.string,
    order: propTypes.oneOf(['asc', 'desc']),
  }),
  /** Callback fire when sort changed */
  onSortChange: propTypes.func,
}

export default Sortable
