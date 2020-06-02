import React, { useEffect } from 'react'
import classNames from 'classnames'
import propTypes from 'prop-types'
import TableContext from './TableContext'
import { TableBody } from "./TableBody"
import { TableHeader } from "./TableHeader"
import { Sortable } from "./Sortable"
import { TableSSF } from "./TableSSF"
import UseTableReducer from './UseTableReducer'
import styles from './Table.module.scss'

const Table = ({
	controlled,
	children,
	className,
	...otherProps
}) => {
	const [state, actions] = UseTableReducer()
	const { setControlled } = actions

	useEffect(() => {
		setControlled(controlled)
	}, [controlled, setControlled])

	const classes = classNames(
		styles.table,
		className,
	)

	return (
		<TableContext.Provider value={ { state, ...actions } }>
			<div className={ classes } { ...otherProps }>
				{ children }
			</div>
		</TableContext.Provider>
	)
}

Table.defaultProps = {
	controlled: true
}

Table.propTypes = {
	/** If false, SSF, Sort, etc.. controlled by the table component */
	controlled: propTypes.bool,
	/** For css customization. */
	className: propTypes.string,
	/** Table components */
	children: propTypes.node,
}

Table.Body = TableBody
Table.Header = TableHeader
Table.Sortable = Sortable
Table.SSF = TableSSF

export default Table
