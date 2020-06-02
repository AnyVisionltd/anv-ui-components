import React, { useState } from 'react'
import Radio from './Radio'
import styles from '../../styles/storybook/index.module.scss'
import { centerDecorator } from "../../utils/storybook/decorators"
import { boolean, text } from "@storybook/addon-knobs"

export default {
	title: 'Components/Radio',
	component: Radio,
	decorators: [centerDecorator]
}

export const Default = () => {
	const [isChecked, setChecked] = useState(false)
	const onChange = ({ target }) => {
		setChecked(target.checked)
	}

	return (
		<>
			<Radio
				checked={ isChecked }
				onChange={ onChange }
				id="radio-example"
			/>
			<label htmlFor="radio-example" className={ styles.checkboxLabel }>
                Check me out!
			</label>
		</>
	)
}

export const states = () => (
	<>
		<Radio className={ styles.microMargin } checked />
		<Radio className={ styles.microMargin } />
		<Radio className={ styles.microMargin } checked disabled />
		<Radio className={ styles.microMargin } disabled />
	</>
)

export const playground = () => (
	<>
		<Radio
			checked={ boolean('checked', false) }
			disabled={ boolean('disabled', false) }
			id="radio-playground"
		/>
		<label htmlFor="radio-playground" className={ styles.checkboxLabel }>
			{ text('Label text', 'Hit me!') }
		</label>
	</>
)