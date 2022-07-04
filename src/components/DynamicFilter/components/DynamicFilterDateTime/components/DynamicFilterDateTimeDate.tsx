import moment from 'moment'
import React, { FC, ReactElement } from 'react'
import { DateTimePicker } from '../../../../DateTimePicker'
import { Radio } from '../../../../Radio'
import { DateTimeVarientType } from '../../../utils'

interface DynamicFilterDateTimeDateProps {
  styles: any
  selectedType: DateTimeVarientType
  setSelectedType: (type: DateTimeVarientType) => void
  onDatePickerOpen: (isOpen: boolean) => void
  selectedTime: any
  onChangeDates: (type: string, selectedDate: string) => void
  otherPropsFrom: any
  otherPropsTo: any
  varientType: DateTimeVarientType
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
  varientType,
}): ReactElement => {
  const isShowRadio = varientType !== DateTimeVarientType.Time
  return (
    <div className={styles.itemContainer}>
      {isShowRadio && (
        <Radio
          checked={selectedType === DateTimeVarientType.Time}
          onChange={() => setSelectedType(DateTimeVarientType.Time)}
          indeterminate={undefined}
          disabled={undefined}
          view={undefined}
          className={undefined}
          id={DateTimeVarientType.Time}
        />
      )}
      <div className={styles.durationContainer}>
        <span className={styles.subTitle}>Specific Time</span>
        <div className={styles.durationInputContainer}>
          <DateTimePicker
            onOpenMenu={onDatePickerOpen}
            label={'From Date & Time'}
            value={selectedTime.from}
            onChange={value => {
              onChangeDates('from', moment(value).toISOString())
            }}
            isNullValue
            maxDate={selectedTime.to}
            debounceTime={undefined}
            disabled={selectedType !== DateTimeVarientType.Time}
            disablePast={undefined}
            format={undefined}
            minDate={undefined}
            errorMessage={undefined}
            onClose={undefined}
            disableFuture={undefined}
            {...otherPropsFrom}
          />
          <DateTimePicker
            onOpenMenu={onDatePickerOpen}
            label={'To Date & Time'}
            value={selectedTime.to}
            onChange={value => {
              onChangeDates('to', moment(value).toISOString())
            }}
            isNullValue
            minDate={selectedTime.from}
            maxDate={undefined}
            debounceTime={undefined}
            disabled={selectedType !== DateTimeVarientType.Time}
            disablePast={undefined}
            format={undefined}
            errorMessage={undefined}
            onClose={undefined}
            disableFuture={undefined}
            {...otherPropsTo}
          />
        </div>
      </div>
    </div>
  )
}

export default DynamicFilterDateTimeDate
