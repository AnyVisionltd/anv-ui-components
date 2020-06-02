import React, { useContext, useEffect } from 'react'
import propTypes from 'prop-types'
import TableContext from '../TableContext'

const Selection = ({
  onSelectionChange,
}) => {
  const { state, setSelectionActivity } = useContext(TableContext)
  const { items, exceptMode } = state.selection

  useEffect(() => {
    onSelectionChange({ items, exceptMode })
  }, [onSelectionChange, items, exceptMode])

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
