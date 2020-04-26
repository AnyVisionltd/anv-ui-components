import React from 'react'
import Portal from './Portal'

export default {
  title: 'Portal',
  component: Portal,
}

export const Usage = () => (
  <Portal containerId="portal-name">
    <h3>Inspect Me! Im on the body element!!</h3>
  </Portal>
)
