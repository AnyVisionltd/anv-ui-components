import React, { useContext, useEffect } from 'react'
import propTypes from 'prop-types'
import TableContext from '../TableContext'

const Selection = ({
  onSelectionChange,
}) => {
  const { state, setSelectionActivity } = useContext(TableContext)
  const { items, subtractionMode } = state.selection

  useEffect(() => {
    onSelectionChange({ items, subtractionMode })
  }, [onSelectionChange, items, subtractionMode])

  useEffect(() => {
    setSelectionActivity(true)
  }, [setSelectionActivity])

  return <></>
}

Selection.defaultProps = {
  onSelectionChange: () => {
  },
}

Selection.propTypes = {
  /** Callback fire when selection changed */
  onSelectionChange: propTypes.func,
}

export default Selection
