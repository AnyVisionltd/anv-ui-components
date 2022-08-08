import React from 'react'
import { centerDecorator } from '../../utils/storybook/decorators'
import { Button } from '../../index'
import Accordion from './Accordion'

export default {
  title: 'Content/Accordion',
  component: Accordion,
  decorators: [centerDecorator],
}

const data = [
  {
    id: 1,
    title: 'Click Me! 😄',
    content: `Sint non amet Lorem non aliqua aliqua labore. Voluptate in reprehenderit 
  ex consectetur dolor ut sint tempor et consequat officia dolore ut nisi. Aliquip consectetur 
  reprehenderit adipisicing deserunt sunt ullamco laborum cillum dolor aute eiusmod eiusmod fugiat nulla.`,
  },
  {
    id: 2,
    title: 'Click Me! 😂',
    content: `Sint non amet Lorem non aliqua aliqua labore. Voluptate in reprehenderit 
  ex consectetur dolor ut sint tempor et consequat officia dolore ut nisi. Aliquip consectetur`,
  },
  {
    id: 3,
    title: 'Click Me! 🗽',
    content: `Sint non amet Lorem non aliqua aliqua labore. Voluptate in reprehenderit 
  ex consectetur dolor ut sint tempor et consequat officia dolore ut nisi. Aliquip consectetur 
  reprehenderit adipisicing deserunt sunt ullamco laborum cillum dolor aute eiusmod eiusmod fugiat nulla.`,
    disabled: true,
  },
]

const withElements = [
  {
    id: 1,
    title: <Button>Click me</Button>,
    content: (
      <div style={{ display: 'flex' }}>
        content with elements<Button>Click me too</Button>
      </div>
    ),
  },
]

const withLongContent = [
  {
    id: 1,
    title: 'Very long content',
    content: `Sint non amet Lorem non aliqua aliqua labore. Voluptate in reprehenderit 
ex consectetur dolor ut sint tempor et consequat officia dolore ut nisi. Aliquip consectetur 
reprehenderit adipisicing deserunt sunt ullamco laborum cillum dolor aute eiusmod eiusmod fugiat nulla.Sint non amet Lorem non aliqua aliqua labore. Voluptate in reprehenderit 
ex consectetur dolor ut sint tempor et consequat officia dolore ut nisi. Aliquip consectetur 
reprehenderit adipisicing deserunt sunt ullamco laborum cillum dolor aute eiusmod eiusmod fugiat nulla.Sint non amet Lorem non aliqua aliqua labore. Voluptate in reprehenderit 
ex consectetur dolor ut sint tempor et consequat officia dolore ut nisi. Aliquip consectetur 
reprehenderit adipisicing deserunt sunt ullamco laborum cillum dolor aute eiusmod eiusmod fugiat nulla.Sint non amet Lorem non aliqua aliqua labore. Voluptate in reprehenderit 
ex consectetur dolor ut sint tempor et consequat officia dolore ut nisi. Aliquip consectetur 
reprehenderit adipisicing deserunt sunt ullamco laborum cillum dolor aute eiusmod eiusmod fugiat nulla.Sint non amet Lorem non aliqua aliqua labore. Voluptate in reprehenderit 
ex consectetur dolor ut sint tempor et consequat officia dolore ut nisi. Aliquip consectetur 
reprehenderit adipisicing deserunt sunt ullamco laborum cillum dolor aute eiusmod eiusmod fugiat nulla.
ex consectetur dolor ut sint tempor et consequat officia dolore ut nisi. Aliquip consectetur 
reprehenderit adipisicing deserunt sunt ullamco laborum cillum dolor aute eiusmod eiusmod fugiat nulla.Sint non amet Lorem non aliqua aliqua labore. Voluptate in reprehenderit 
ex consectetur dolor ut sint tempor et consequat officia dolore ut nisi. Aliquip consectetur 
reprehenderit adipisicing deserunt sunt ullamco laborum cillum dolor aute eiusmod eiusmod fugiat nulla.Sint non amet Lorem non aliqua aliqua labore. Voluptate in reprehenderit 
ex consectetur dolor ut sint tempor et consequat officia dolore ut nisi. Aliquip consectetur 
reprehenderit adipisicing deserunt sunt ullamco laborum cillum dolor aute eiusmod eiusmod fugiat nulla.Sint non amet Lorem non aliqua aliqua labore. Voluptate in reprehenderit 
ex consectetur dolor ut sint tempor et consequat officia dolore ut nisi. Aliquip consectetur 
reprehenderit adipisicing deserunt sunt ullamco laborum cillum dolor aute eiusmod eiusmod fugiat nulla.Sint non amet Lorem non aliqua aliqua labore. Voluptate in reprehenderit 
ex consectetur dolor ut sint tempor et consequat officia dolore ut nisi. Aliquip consectetur 
reprehenderit adipisicing deserunt sunt ullamco laborum cillum dolor aute eiusmod eiusmod fugiat nulla.
ex consectetur dolor ut sint tempor et consequat officia dolore ut nisi. Aliquip consectetur 
reprehenderit adipisicing deserunt sunt ullamco laborum cillum dolor aute eiusmod eiusmod fugiat nulla.Sint non amet Lorem non aliqua aliqua labore. Voluptate in reprehenderit 
ex consectetur dolor ut sint tempor et consequat officia dolore ut nisi. Aliquip consectetur 
reprehenderit adipisicing deserunt sunt ullamco laborum cillum dolor aute eiusmod eiusmod fugiat nulla.Sint non amet Lorem non aliqua aliqua labore. Voluptate in reprehenderit 
ex consectetur dolor ut sint tempor et consequat officia dolore ut nisi. Aliquip consectetur 
reprehenderit adipisicing deserunt sunt ullamco laborum cillum dolor aute eiusmod eiusmod fugiat nulla.Sint non amet Lorem non aliqua aliqua labore. Voluptate in reprehenderit 
ex consectetur dolor ut sint tempor et consequat officia dolore ut nisi. Aliquip consectetur 
reprehenderit adipisicing deserunt sunt ullamco laborum cillum dolor aute eiusmod eiusmod fugiat nulla.Sint non amet Lorem non aliqua aliqua labore. Voluptate in reprehenderit 
ex consectetur dolor ut sint tempor et consequat officia dolore ut nisi. Aliquip consectetur 
reprehenderit adipisicing deserunt sunt ullamco laborum cillum dolor aute eiusmod eiusmod fugiat nulla.`,
  },
]

const withLongTitle = [
  {
    id: 1,
    title:
      'Very long title Very long title Very long title Very long title Very long title Very long title Very long title Very long title Very long title Very long title',
    content: `Sint non amet Lorem non aliqua aliqua labore. Voluptate in reprehenderit ex consectetur dolor ut sint tempor et cons`,
  },
]

export const Basic = () => {
  return <Accordion data={data} />
}

export const ExpandAll = () => {
  return <Accordion expandAll data={data} />
}

export const DisableAll = () => {
  return <Accordion disableAll data={data} />
}

export const WithElements = () => {
  return <Accordion data={withElements} />
}

export const WithLongTitle = () => {
  return <Accordion data={withLongTitle} />
}
export const WithLongContent = () => {
  return <Accordion data={withLongContent} />
}
