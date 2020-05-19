import React from 'react'
import SmartSearch from './SmartSearch'
import { centerDecorator } from '../../utils/storybook/decorators'
import { ReactComponent as EyeEnabled } from '../../assets/svg/EyeEnabled.svg'
import { ReactComponent as ArrowSolidRight } from '../../assets/svg/ArrowSolidRight.svg'
import styles from '../../styles/storybook/index.module.scss'

export default {
  title: 'Components/SmartSearch',
  component: SmartSearch,
  decorators: [centerDecorator],
}

const rows = [
  {
    column: 'subjectName', label: 'Subject Name', type: 'text', isDefault: true,
  },
  {
    column: 'age', type: 'number', label: 'Age', isDefault: false, icon: <ArrowSolidRight />,
  },
  {
    column: 'subjectDescription', label: 'Description', type: 'text', isDefault: true, icon: <EyeEnabled />,
  },
]

export const Default = () => {
  const onChange = (search) => {
    console.log(search) // eslint-disable-line no-console
  }
  return (
    <div className={ styles.marginFlexContainer }>
      <SmartSearch
        fields={ rows }
        onChange={ onChange }
      />
    </div>
  )
}
