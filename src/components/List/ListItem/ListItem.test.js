import React from 'react'
import { render } from '@testing-library/react'
import ListItem from './ListItem'


describe('<ListItem />', () => {
  it('should render leadingComponent, children, trailingComponent', () => {
    const { queryByText } = render(
	  <ListItem
        leadingComponent={ <div>leading</div> }
        trailingComponent={ <div>trailing</div> }
	  >
		mockData
	  </ListItem>
    )
    queryByText('leading')
    queryByText('mockData')
    queryByText('trailing')
  })
})
