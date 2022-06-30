import { createContext } from 'react'
import { DynamicFilterStateInterface } from '../utils'
import { DynamicFilterActions } from './DynamicFilterActions'

interface ProviderStore {
  state: DynamicFilterStateInterface
  actions: any
}

const DynamicFilterContext = createContext({} as ProviderStore)
DynamicFilterContext.displayName = 'DynamicFilterContext'

export default DynamicFilterContext
