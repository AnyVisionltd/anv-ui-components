import React from 'react'
import propTypes from 'prop-types'
import ViewContext from './Context'

/**
 * Wrapper for forms which add view capabilty for supported components.
 * Supported components - <TextField/>,
 */

const ViewProvider = ({ isView, children }) => (
  <ViewContext.Provider value={isView}>{children}</ViewContext.Provider>
)

ViewProvider.Context = ViewContext

ViewProvider.propTypes = {
  isView: propTypes.bool.isRequired,
  children: propTypes.any,
}

export default ViewProvider
