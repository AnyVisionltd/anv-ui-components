import React, { useRef } from 'react'
import Tooltip from './Tooltip'
import { centerDecorator } from '../../utils/storybook/decorators'
import { Button } from '../Button'

export default {
  title: 'Content/Tooltip',
  component: Tooltip,
  decorators: [centerDecorator],
}

export const Default = () => {
  const renderTooltipContent = () => <p>I'm a tooltip!</p>

  return (
    <Tooltip content={renderTooltipContent()}>
      <h6>Hover over me!</h6>
    </Tooltip>
  )
}

export const ArrowVariations = () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <Tooltip content={'Right'} placement={'right'} arrow={true}>
        <h6>Right</h6>
      </Tooltip>
      <Tooltip content={'Left'} placement={'left'} arrow={true}>
        <h6>Left</h6>
      </Tooltip>
      <Tooltip content={'Top'} placement={'top'} arrow={true}>
        <h6>Top</h6>
      </Tooltip>
      <Tooltip content={'Bottom'} placement={'bottom'} arrow={true}>
        <h6>Bottom</h6>
      </Tooltip>
    </div>
  )
}

export const Interactive = () => {
  const anchorRef = useRef()

  const footerContainer = {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
  }

  const renderContent = () => (
    <div>
      <div>Hover me!</div>
      <div>Lorem ipsum dolor sit amet, consectetur adipiscing</div>
      <div>
        <div style={footerContainer}>
          <Button variant={'ghost'} size='small'>
            Skip
          </Button>
          <Button size='small'>Next</Button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <Tooltip
        anchorRef={anchorRef}
        placement={'right'}
        offset={20}
        leaveDelay={500}
        content={renderContent()}
      >
        <h6>Hover over me!</h6>
      </Tooltip>
    </>
  )
}

export const OverflowOnly = () => {
  const longText = 'long long long long long long text'

  return (
    <div>
      <Tooltip overflowOnly={true} content={'shot text'}>
        <h6 style={{ width: '50px', overflow: 'hidden', whiteSpace: 'nowrap' }}>
          shot text
        </h6>
      </Tooltip>
      <Tooltip overflowOnly={true} content={longText}>
        <h6
          style={{
            width: '50px',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}
        >
          {longText}
        </h6>
      </Tooltip>
    </div>
  )
}
