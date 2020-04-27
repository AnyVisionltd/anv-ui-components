// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import React from 'react'
import ReactDOM from 'react-dom'
import '@testing-library/jest-dom/extend-expect'
import initStoryshots from '@storybook/addon-storyshots'

// Tests portal workaround - https://github.com/Quramy/storyshots-with-portal-repro
ReactDOM.createPortal = (node) => React.createElement('portal-for-test', null, node)

initStoryshots()
