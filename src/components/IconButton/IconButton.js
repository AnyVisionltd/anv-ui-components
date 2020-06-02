import React, { forwardRef } from 'react'
import classNames from 'classnames'
import propTypes from 'prop-types'
import { Button } from '../Button'
import styles from './IconButton.module.scss'

const IconButton = forwardRef(({
	size,
	variant,
	className,
	children,
	...buttonProps
}, ref) => {
	const classes = classNames(
		styles.iconButton,
		styles[size],
		styles[variant],
		className,
	)

	return (
		<Button
			ref={ ref }
			className={ classes }
			variant={ variant }
			{ ...buttonProps }
		>
			{ children }
		</Button>
	)
})

IconButton.defaultProps = {
	size: 'small',
	variant: 'fill',
	disabled: false,
	onClick: () => {},
}

IconButton.propTypes = {
	/** The size of the button. */
	size: propTypes.oneOf(['small', 'large']),
	/** The variant of the button. */
	variant: propTypes.oneOf(['fill', 'outline', 'ghost']),
	/** If true, the button will be disabled. */
	disabled: propTypes.bool,
	/** Callback when click. */
	onClick: propTypes.func,
	/** For css customization. */
	className: propTypes.string,
	/** The component icon. */
	children: propTypes.node.isRequired,
}

export default IconButton
