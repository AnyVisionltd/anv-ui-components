import React from 'react'
import { ReactComponent as CheckboxAdd } from '../../../assets/svg/CheckboxAdd.svg'
import { ReactComponent as CheckboxIndeterminate } from '../../../assets/svg/CheckboxIndeterminate.svg'
import { Checkbox } from '../../Checkbox'

const CheckboxWithIndeterminateState = props => {
  const renderIcon = checked => {
    if (checked) {
      return <CheckboxIndeterminate />
    }
    return <CheckboxAdd />
  }

  return <Checkbox {...props} renderIcon={renderIcon} indeterminate />
}

export default CheckboxWithIndeterminateState
