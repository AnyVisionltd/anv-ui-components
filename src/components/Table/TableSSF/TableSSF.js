import React, { useContext, useMemo } from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import TableContext from '../TableContext'
import { SSF } from '../../../index'
import styles from './TableSSF.module.scss'

const TableSSF = ({ onChange, className }) => {
	const { state, setFilters } = useContext(TableContext)
	const { headers } = state

	const fields = useMemo(() => headers.map(headers => ({
		field: headers.field,
		label: headers.label || headers.content,
		...(headers.type  && { type: headers.type })
	})
	)
	, [headers])

	const handleOnChange = filters => {
		onChange(filters)
		setFilters(filters)
	}

	const classes = classNames(
		styles.TableSSF,
		className
	)

	return <SSF className={ classes } fields={ fields } onChange={ handleOnChange }/>
}

TableSSF.defaultProps = {
	onChange: () => {}
}

TableSSF.propTypes = {
	/** Callback fired when filters changed. */
	onChange: propTypes.func,
	/** For css customization. */
	className: propTypes.string,
}

export default TableSSF
