import React, { FC, ReactElement } from 'react'
import { MenuSelect } from '../../../../MenuSelect'
import { Radio } from '../../../../Radio'
import { TextField } from '../../../../TextField'
import {
  DateTimeVariantType,
  minDurationValue,
  stepDuration,
} from '../../../utils'

interface DynamicFilterDateTimeDurationProps {
  styles: any
  selectedType: DateTimeVariantType
  setSelectedType: (type: DateTimeVariantType) => void
  durationInputValue: string | number
  onDurationInputChange: (event: any) => void
  selectedDurationOption: any
  setSelectedDurationOption: (option: any) => void
  variantType: DateTimeVariantType
  translations: Record<string, string>
  durationOptions: Array<Record<string, string>>
  setIsMenuDropdownOpen: (value: boolean) => void
  elementKey: string
  isOnDarkTheme: boolean
}

const DynamicFilterDateTimeDuration: FC<DynamicFilterDateTimeDurationProps> = ({
  styles,
  selectedType,
  setSelectedType,
  durationInputValue,
  onDurationInputChange,
  selectedDurationOption,
  setSelectedDurationOption,
  variantType,
  translations,
  durationOptions,
  setIsMenuDropdownOpen,
  elementKey,
  isOnDarkTheme,
}): ReactElement => {
  const isShowRadio = variantType !== DateTimeVariantType.Duration

  const fixedMenuItemsFilter = durationOptions.map(option => ({
    element: option.value,
    callback: () => setSelectedDurationOption(option),
    isSelected: selectedDurationOption.id === option.id,
    key: option.id,
  }))

  return (
    <div className={styles.itemContainer}>
      {isShowRadio && (
        // @ts-ignore
        <Radio
          checked={selectedType === DateTimeVariantType.Duration}
          onChange={() => setSelectedType(DateTimeVariantType.Duration)}
          id={DateTimeVariantType.Duration}
        />
      )}
      <div className={styles.durationContainer}>
        <span className={styles.subTitle}>
          {translations.DateTimeDurationSubLabel}
        </span>
        <div className={styles.durationInputContainer}>
          <TextField
            // @ts-ignore
            value={durationInputValue}
            onChange={onDurationInputChange}
            type={'number'}
            min={minDurationValue}
            step={stepDuration}
            className={styles.durationInput}
            disabled={selectedType !== DateTimeVariantType.Duration}
            data-testid={'duration-input'}
          />
          <MenuSelect
            menuContainerId={'duration-steps-' + elementKey}
            preferOpenDirection={'bottom-start'}
            items={fixedMenuItemsFilter}
            selectedData={selectedDurationOption.value}
            toggleCallback={setIsMenuDropdownOpen}
            disabled={selectedType !== DateTimeVariantType.Duration}
            label={translations.DateTimeDurationDropdownLabel}
            className={isOnDarkTheme && styles.menuOnDarkerSurface}
          />
        </div>
      </div>
    </div>
  )
}

export default DynamicFilterDateTimeDuration
