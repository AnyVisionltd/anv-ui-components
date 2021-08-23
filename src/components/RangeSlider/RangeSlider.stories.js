import React, { useState } from 'react'
import RangeSlider from './'
import { centerDecorator } from '../../utils/storybook/decorators'
import styles from './RangeSlider.module.scss'

export default {
  title: 'User Inputs/RangeSlider',
  component: RangeSlider,
  decorators: [centerDecorator],
}

export const Basic = () => {
  const [value, setValue] = useState(50)

  return (
    <RangeSlider
      min={0}
      max={100}
      value={value}
      onChange={e => setValue(e.target.value)}
      className={styles.width}
    />
  )
}

export const ToggledTooltip = () => {
  const [value, setValue] = useState(60)

  return (
    <RangeSlider
      min={0}
      max={100}
      value={value}
      onChange={e => setValue(e.target.value)}
      isToggleTooltip
      className={styles.width}
    />
  )
}

export const Disabled = () => {
  const [value, setValue] = useState(40)

  return (
    <RangeSlider
      min={0}
      max={100}
      value={value}
      disabled
      onChange={e => setValue(e.target.value)}
      className={styles.width}
    />
  )
}

export const DifferentSteps = () => {
  const [value1, setValue1] = useState(42)
  const [value2, setValue2] = useState(50)
  const [value3, setValue3] = useState(0.4)
  const [value4, setValue4] = useState(0.55)
  const [value5, setValue5] = useState(0.632)

  return (
    <>
      <RangeSlider
        min={0}
        max={100}
        value={value1}
        step={2}
        onChange={e => setValue1(e.target.value)}
        className={styles.width}
      />

      <RangeSlider
        min={0}
        max={100}
        value={value2}
        step={1}
        onChange={e => setValue2(e.target.value)}
        className={styles.width}
      />

      <RangeSlider
        min={0}
        max={1}
        value={value3}
        onChange={e => setValue3(e.target.value)}
        step={0.1}
        className={styles.width}
      />

      <RangeSlider
        min={0}
        max={1}
        value={value4}
        onChange={e => setValue4(e.target.value)}
        step={0.01}
        className={styles.width}
      />

      <RangeSlider
        min={0}
        max={1}
        value={value5}
        onChange={e => setValue5(e.target.value)}
        step={0.001}
        className={styles.width}
      />
    </>
  )
}

export const DifferentMeasureUnits = () => {
  const [value1, setValue1] = useState(10)
  const [value2, setValue2] = useState(30)

  return (
    <>
      <RangeSlider
        min={0}
        max={24}
        value={value1}
        step={1}
        onChange={e => setValue1(e.target.value)}
        measureUnitText={'H'}
        className={styles.width}
      />

      <RangeSlider
        min={0}
        max={60}
        value={value2}
        step={1}
        onChange={e => setValue2(e.target.value)}
        measureUnitText={'min'}
        className={styles.width}
      />
    </>
  )
}
