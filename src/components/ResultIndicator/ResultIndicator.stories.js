import React from 'react'
import ResultIndicator from './ResultIndicator'
import { centerDecorator } from '../../utils/storybook/decorators'

export default {
  title: 'User Feedback/ResultIndicator',
  component: ResultIndicator,
  decorators: [centerDecorator],
}

const containerStyle = {
  width: '50%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
}

export const Basic = () => {
  return (
    <div style={containerStyle}>
      <ResultIndicator error />
      <ResultIndicator success />
      <ResultIndicator stopped />
      <ResultIndicator inQueue />
      <div style={{ display: 'flex' }}>
        <ResultIndicator isTiny error errorMessage='Fail' />
        <ResultIndicator isTiny success successMessage='Success' />
        <ResultIndicator isTiny stopped />
        <ResultIndicator isTiny inQueue />
      </div>
    </div>
  )
}
