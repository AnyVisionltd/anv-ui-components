import React, { FC, ReactElement } from 'react'
import { Dropdown } from '../../../../Dropdown'
import { Radio } from '../../../../Radio'
import { TextField } from '../../../../TextField'
import {
  DateTimeVarientType,
  durationOptions,
  minDurationValue,
  stepDuration,
} from '../../../utils'

interface DynamicFilterDateTimeDurationProps {
  styles: any
  selectedType: DateTimeVarientType
  setSelectedType: (type: DateTimeVarientType) => void
  durationInputValue: string | number
  onDurationInputChange: (event: any) => void
  selectedDurationOption: any
  setSelectedDurationOption: (option: any) => void
  varientType: DateTimeVarientType
}

const DynamicFilterDateTimeDuration: FC<DynamicFilterDateTimeDurationProps> = ({
  styles,
  selectedType,
  setSelectedType,
  durationInputValue,
  onDurationInputChange,
  selectedDurationOption,
  setSelectedDurationOption,
  varientType,
}): ReactElement => {
  const isShowRadio = varientType !== DateTimeVarientType.Duration

  return (
    <div className={styles.itemContainer}>
      {isShowRadio && (
        <Radio
          checked={selectedType === DateTimeVarientType.Duration}
          onChange={() => setSelectedType(DateTimeVarientType.Duration)}
          indeterminate={undefined}
          disabled={undefined}
          view={undefined}
          className={undefined}
          id={DateTimeVarientType.Duration}
        />
      )}
      <div className={styles.durationContainer}>
        <span className={styles.subTitle}>During the Last</span>
        <div className={styles.durationInputContainer}>
          <TextField
            value={durationInputValue}
            onChange={onDurationInputChange}
            type={'number'}
            min={minDurationValue}
            step={stepDuration}
            className={styles.durationInput}
            disabled={selectedType !== DateTimeVarientType.Duration}
          />
          <Dropdown
            label={'Durtion'}
            options={durationOptions}
            defaultValues={[selectedDurationOption]}
            className={styles.durationSteps}
            onChange={options => setSelectedDurationOption(options[0])}
            disabled={selectedType !== DateTimeVarientType.Duration}
          />
        </div>
      </div>
    </div>
  )
}

export default DynamicFilterDateTimeDuration
