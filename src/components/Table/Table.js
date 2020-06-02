import React, { useEffect } from 'react'
import classNames from 'classnames'
import propTypes from 'prop-types'
import TableContext from './TableContext'
import { TableBody } from "./TableBody"
import { TableHeader } from "./TableHeader"
import { Sortable } from "./Sortable"
import { TableSSF } from "./TableSSF"
import { Selection } from "./Selection"
import UseTableReducer from './UseTableReducer'
import styles from './Table.module.scss'

const Table = ({
	selfControlled,
	children,
	className,
	...otherProps
}) => {
	const [state, actions] = UseTableReducer()
	const { setSelfControlled } = actions

	useEffect(() => {
		setSelfControlled(selfControlled)
	}, [selfControlled, setSelfControlled])

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
	selfControlled: false
}

Table.propTypes = {
	/** If true, SSF, Sort, etc.. controlled by the table component */
	selfControlled: propTypes.bool,
	/** For css customization. */
	className: propTypes.string,
	/** Table components */
	children: propTypes.node,
}

Table.Body = TableBody
Table.Header = TableHeader
Table.Sortable = Sortable
Table.SSF = TableSSF
Table.Selection = Selection

export default Table
