import React from 'react'
import classNames from 'classnames'
import propTypes from 'prop-types'
import styles from './Switch.module.scss'

const Switch = ({
	id,
	className,
	checked,
	disabled,
	onChange,
	...otherProps
}) => {
	const classes = classNames(
		styles.switch,
		!checked && styles.unchecked,
		disabled ? styles.disabled : styles.enabled,
		className,
	)

	return (
		<div className={ classes }>
			<input
				id={ id }
				type="checkbox"
				disabled={ disabled }
				hidden="hidden"
				defaultChecked={ checked }
				onChange={ onChange }
				{ ...otherProps }
			/>
			<label
				className={ styles.switchLabel }
				htmlFor={ id }
			>
				<div className={ styles.switchLine } />
				<div className={ styles.switchToggle }>
					<span className={ styles.switchToggleInner } />
				</div>
			</label>
		</div>
	)
}

Switch.defaultProps = {
	checked: true,
	disabled: false,
	onChange: () => {},
}

Switch.propTypes = {
	/** Form control ID - for label association. */
	id: propTypes.string,
	/** For css customization. */
	className: propTypes.string,
	/** Whether the switch is checked or not. */
	checked: propTypes.bool,
	/** If true, the switch will be disabled. */
	disabled: propTypes.bool,
	/** Callback when changed. */
	onChange: propTypes.func,
}

export default Switch
