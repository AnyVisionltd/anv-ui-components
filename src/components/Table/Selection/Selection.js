import React, { useContext, useEffect } from 'react'
import propTypes from 'prop-types'
import TableContext from '../TableContext'

const Selection = ({
  onChange,
  value
}) => {
  const { state, setSelectionActivity, setSelection } = useContext(TableContext)
  const { items, exceptMode } = state.selection

  useEffect(() => {
    onChange({ items, exceptMode })
  }, [onChange, items, exceptMode])

  useEffect(() => {
    setSelectionActivity(true)
  }, [setSelectionActivity])

  useEffect(() => {
    value && setSelection(value)
  }, [value, setSelection])

  return <></>
}

Selection.defaultProps = {
  onChange: () => {
  },
}

Selection.propTypes = {
  /** Callback fire when selection changed */
  onChange: propTypes.func,
  /** The value from the on change */
  value: propTypes.arrayOf(
    propTypes.shape({
      items: propTypes.array,
      exceptMode: propTypes.bool
    })
  ),
}

export default Selection
