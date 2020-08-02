import React from 'react'
import Portal from './Portal'

export default {
  title: 'Utils/Portal',
  component: Portal,
}

export const Default = () => (
  <Portal containerId="example-portal">
    <h3>Inspect Me. Im on the body</h3>
  </Portal>
)
