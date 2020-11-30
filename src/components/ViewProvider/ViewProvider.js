import React from 'react'
import propTypes from 'prop-types'
import ViewContext from './Context'

/**
 * Wrapper for forms, add view capability for supported components. <br/>
 * Supported components - <code>\<TextField/></code>, <code>\<Checkbox/></code>, <code>\<Radio/></code>
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
