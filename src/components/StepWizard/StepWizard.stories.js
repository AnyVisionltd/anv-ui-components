import React from 'react'
import { boolean } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import { centerDecorator } from '../../utils/storybook/decorators'
import styles from '../../storybook/wizard.module.scss'
import StepWizard from './StepWizard'

export default {
  title: 'Content/StepWizard',
  component: StepWizard,
  decorators: [centerDecorator],
}

export const Basic = () => {
  const stepStyle = { height: '250px' }
  const steps = [
    <div style={stepStyle}>Step 1</div>,
    <div style={stepStyle}>Step 2</div>,
    <div style={stepStyle}>Step 3</div>,
  ]

  const disableBackdropClick = boolean(
    'Disable backdrop click to close dialog',
    false,
  )
  const disableEscapeKeyDown = boolean(
    'Disable escape key press to close dialog',
    false,
  )

  return (
    <StepWizard
      className={styles.wizardExample}
      onNextClick={action('next')}
      disableBackdropClick={disableBackdropClick}
      disableEscapeKeyDown={disableEscapeKeyDown}
      headerTitle={'Header title'}
      footerMessage={
        'Opps! Connection failed, Please re-check your details and try again'
      }
      steps={steps}
    />
  )
}
