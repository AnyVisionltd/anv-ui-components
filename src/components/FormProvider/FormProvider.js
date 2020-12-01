import React from 'react'
import propTypes from 'prop-types'
import FormContext from './Context'

/**
 * Wrapper for forms, add view capability using context for supported components. <br/>
 * Supported components - <code>\<TextField/></code>, <code>\<Checkbox/></code>, <code>\<Radio/></code>
 * <br/>
 * <br/>
 * <code>useFormProvider</code> - hook for getting the isView value.
 */

const FormProvider = ({ isView, children }) => (
  <FormContext.Provider value={isView}>{children}</FormContext.Provider>
)

FormProvider.Context = FormContext

FormProvider.propTypes = {
  isView: propTypes.bool.isRequired,
  children: propTypes.any,
}

export default FormProvider
