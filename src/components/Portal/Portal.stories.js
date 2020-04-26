import React from 'react'
import Portal from './Portal'

export default {
  title: 'Portal',
  component: Portal,
}

export const Usage = () => (
  <Portal containerId="component-name">
    <h1>Inspect Me! Im on the body element!!</h1>
  </Portal>
)
