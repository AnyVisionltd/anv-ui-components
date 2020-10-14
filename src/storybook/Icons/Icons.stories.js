import React, { useState } from 'react'
import { Source } from '@storybook/addon-docs/blocks'
import * as icons from '@anyvision/anv-icons'
import { TextField, Tooltip } from '../../index'
import { centerDecorator } from '../../utils/storybook/decorators'
import styles from './Icons.module.scss'

export default {
  title: 'Icons/Icons',
  decorators: [centerDecorator],
  parameters: {
    docs: {
      disabled: true
    },
    previewTabs: {
      'storybook/docs/panel': {
        hidden: true,
      },
    }
  },
}

export const All = () => {
  const [search, setSearch] = useState('')
  const [iconName, setIconName] = useState('IconName')

  return (
    <div className={ styles.container } >
      <div className={ styles.comment }>* The following icons import from
        <a href={ 'https://github.com/AnyVisionltd/anv-icons' }>@anyvision/anv-icons</a>.
      </div>
      <div className={ styles.searchAndCodeContainer }>
        <TextField
          className={ styles.search }
          placeholder={ 'Search' }
          value={ search }
          onChange={ e => setSearch(e.target.value) }
        />
        <Source language={ 'js' } code={ `
          //import
import { ${iconName} } from '@anyvision/anv-icons'
// use        
<${iconName}/> 
        ` } dark/>
      </div>
      <div className={ styles.icons }>
        {
          Object.entries(icons).map(([name, Icon]) => {
            if(name.toLowerCase().includes(search.toLowerCase())){
              return (
                <div key={ name } className={ styles.iconCard } onClick={ () => setIconName(name) }>
                  <Icon className={ styles.icon }/>
                  <Tooltip overflowOnly arrow content={ name } offset={ 40 }>
                    <span className={ styles.name }>{ name }</span>
                  </Tooltip>
                </div>
              )
            }
            return null
          })
        }
      </div>
    </div>
  )
}
