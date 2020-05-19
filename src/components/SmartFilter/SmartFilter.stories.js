import React from 'react'
import SmartFilter from './SmartFilter'
import { centerDecorator } from '../../utils/storybook/decorators'
import { ReactComponent as EyeEnabled } from '../../assets/svg/EyeEnabled.svg'
import { ReactComponent as ArrowSolidRight } from '../../assets/svg/ArrowSolidRight.svg'
import styles from '../../styles/storybook/index.module.scss'

export default {
  title: 'Components/SmartFilter',
  component: SmartFilter,
  decorators: [centerDecorator],
}

export const Default = () => {
  const fields = [
    {
      field: 'subjectName', label: 'Subject Name', type: 'text',
    },
    {
      field: 'age', type: 'number', label: 'Age', icon: <ArrowSolidRight />,
    },
    {
      field: 'subjectDescription', label: 'Description', type: 'text', icon: <EyeEnabled />,
    },
  ]
  const onChange = (search) => {
    console.log(search) // eslint-disable-line no-console
  }
  return (
    <div className={ styles.marginFlexContainer }>
      <SmartFilter
        fields={ fields }
        onChange={ onChange }
      />
    </div>
  )
}
