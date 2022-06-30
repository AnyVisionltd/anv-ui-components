import { createContext } from 'react'

const initContext = {
  state: {},
  actions: {},
}

const DynamicFilterContext = createContext(initContext)
DynamicFilterContext.displayName = 'DynamicFilterContext'

export default DynamicFilterContext
