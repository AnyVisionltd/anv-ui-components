import { useContext } from 'react'
import { FormProvider } from '../../../index'

const useFormProvider = ({ view }) => {
  const isViewContext = useContext(FormProvider.Context)
  const isView = view !== undefined ? view : !!isViewContext
  return { isView }
}

export default useFormProvider
