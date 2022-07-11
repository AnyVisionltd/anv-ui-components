import React, { FC, ReactElement } from 'react'
import { MenuSelect } from '../../../../MenuSelect'
import { Radio } from '../../../../Radio'
import { TextField } from '../../../../TextField'
import {
  DateTimeVarientType,
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
  translations: Record<string, string>
  durationOptions: Array<Record<string, string>>
  setIsMenuDropdownOpen: (value: boolean) => void
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
  translations,
  durationOptions,
  setIsMenuDropdownOpen,
}): ReactElement => {
  const isShowRadio = varientType !== DateTimeVarientType.Duration

  const fixedMenuItemsFilter = durationOptions.map(option => ({
    element: option.value,
    callback: () => setSelectedDurationOption(option),
    isSelected: selectedDurationOption.id === option.id,
    key: option.id,
  }))

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
        <span className={styles.subTitle}>
          {translations.DateTimeDurationSubLabel}
        </span>
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
          <MenuSelect
            menuContainerId={'duration-steps'}
            preferOpenDirection={'bottom-start'}
            items={fixedMenuItemsFilter}
            selectedData={selectedDurationOption.value}
            toggleCallback={setIsMenuDropdownOpen}
          />
        </div>
      </div>
    </div>
  )
}

export default DynamicFilterDateTimeDuration
