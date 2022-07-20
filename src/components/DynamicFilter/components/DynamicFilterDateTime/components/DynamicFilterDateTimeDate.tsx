import moment from 'moment'
import React, { FC, ReactElement } from 'react'
import { DateTimePicker } from '../../../../DateTimePicker'
import { Radio } from '../../../../Radio'
import { DateTimeVariantType } from '../../../utils'

interface DynamicFilterDateTimeDateProps {
  styles: any
  selectedType: DateTimeVariantType
  setSelectedType: (type: DateTimeVariantType) => void
  onDatePickerOpen: (isOpen: boolean) => void
  selectedTime: any
  onChangeDates: (type: string, selectedDate: string) => void
  otherPropsFrom: any
  otherPropsTo: any
  variantType: DateTimeVariantType
  translations: Record<string, string>
}

const DynamicFilterDateTimeDate: FC<DynamicFilterDateTimeDateProps> = ({
  styles,
  selectedType,
  setSelectedType,
  onDatePickerOpen,
  selectedTime,
  onChangeDates,
  otherPropsFrom,
  otherPropsTo,
  variantType,
  translations,
}): ReactElement => {
  const isShowRadio = variantType !== DateTimeVariantType.Time
  return (
    <div className={styles.itemContainer}>
      {isShowRadio && (
        <Radio
          checked={selectedType === DateTimeVariantType.Time}
          onChange={() => setSelectedType(DateTimeVariantType.Time)}
          indeterminate={undefined}
          disabled={undefined}
          view={undefined}
          className={undefined}
          id={DateTimeVariantType.Time}
        />
      )}
      <div className={styles.durationContainer}>
        <span className={styles.subTitle}>{translations.DateTimeSubLabel}</span>
        <div className={styles.durationInputContainer}>
          <DateTimePicker
            onOpenMenu={onDatePickerOpen}
            label={translations.fromDatePickerLabel}
            value={selectedTime.from}
            onChange={value => {
              onChangeDates('from', moment(value).toISOString())
            }}
            isNullValue
            maxDate={selectedTime.to}
            disabled={selectedType !== DateTimeVariantType.Time}
            {...otherPropsFrom}
            data-testid={'from-date-picker'}
          />
          <DateTimePicker
            onOpenMenu={onDatePickerOpen}
            label={translations.toDatePickerLabel}
            value={selectedTime.to}
            onChange={value => {
              onChangeDates('to', moment(value).toISOString())
            }}
            isNullValue
            minDate={selectedTime.from}
            disabled={selectedType !== DateTimeVariantType.Time}
            {...otherPropsTo}
            data-testid={'to-date-picker'}
          />
        </div>
      </div>
    </div>
  )
}

export default DynamicFilterDateTimeDate
