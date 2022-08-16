import { createContext } from 'react'
import { DynamicFilterStateInterface } from '../utils'

interface ProviderStore {
  state: DynamicFilterStateInterface
  actions: any
}

const DynamicFilterContext = createContext({} as ProviderStore)
DynamicFilterContext.displayName = 'DynamicFilterContext'

export default DynamicFilterContext
